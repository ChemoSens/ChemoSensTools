module Models {

    export enum DataType {
        None, Profile, TDS, Hedonic, ITIP, PSP, Question, Sorting, Napping, TriangleTest, ProgressiveProfile, Ranking, AFC3, Event, TOS, Ethologic, CATA, TCATA, DynamicLiking, TDL, FlashProfile, LongitudinalProfile, ProgressiveLiking, DynamicProfile, AlternatedProfile, TI, Emotion, FreeTextQuestion, MultipleAnswersQuestion, SingleAnswerQuestion, SpeechToText, Sentiment, BSB
    }

    export var GenderEnum: string[] = ["Male", "Female"];

    export function GetListGenders(): Framework.KeyValuePair[] {
        let res = [];
        Models.GenderEnum.forEach((x) => { res.push(new Framework.KeyValuePair(x, Framework.LocalizationManager.Get(x))); });
        return res;
    }

    export var EducationLevelEnum: string[] = ["PrimaryStudies", "SecondaryStudies", "GraduateStudies"];

    export var ProfessionalActivityEnum: string[] = ["Student", "Unemployed", "Retired", "Farmer", "CraftmanOrMerchant", "ExecutiveAndUpperIntellectualProfession", "IntermediateProfession", "Employee", "Worker", "Other"];

    export var FamilialStatusEnum: string[] = ["Alone", "Couple", "AloneWithOneChild", "AloneWithTwoOrMoreChild", "CoupleWithOneChild", "CoupleWithTwoOrMoreChild"];

    export class SubjectSeance {
        public Description: string;
        public UploadedDate: Date;
        public LastUpload: Date;
        public Access: Access;
        public Progress: Progress = new Progress();
        public ListExperimentalDesigns: ExperimentalDesign[] = [];
        public ListScreens: Screen[] = [];
        public Subject: Subject;
        public UploadId: number;
        public BrowserCheckMode: string;
        //
    }

    export class TemplatedSubjectSeance extends SubjectSeance {
        public ListSubjects: Subject[];
        public ShowSubjectCodeOnClient: string;
        public UploadPassword: string;
        public ExpirationDate: Date;
        public MailPath: string;
        public Login: string;
        public Password: string;
        public MinTimeBetweenConnexions: number;
        public Culture: string;
        public ServerCode: string;


        public static CreateTemplatedSubjectSeance(session: PanelLeaderModels.Session, license: Models.Account): Models.TemplatedSubjectSeance {
            let templatedSubjectSeance: Models.TemplatedSubjectSeance = new Models.TemplatedSubjectSeance();
            templatedSubjectSeance.ListScreens = session.ListScreens;
            templatedSubjectSeance.ListSubjects = session.ListSubjects;
            templatedSubjectSeance.ListExperimentalDesigns = session.ListExperimentalDesigns;
            templatedSubjectSeance.Access = new Models.Access();
            templatedSubjectSeance.Access.ListAuthorizedDates = []; //TODO
            templatedSubjectSeance.Access.AnonymousMode = session.Upload.AnonymousMode;
            templatedSubjectSeance.Access.AnonymousForcedMail = false; //TODO
            templatedSubjectSeance.Access.Password = ""; //TODO
            templatedSubjectSeance.ShowSubjectCodeOnClient = session.Upload.ShowSubjectCodeOnClient;
            templatedSubjectSeance.BrowserCheckMode = session.Upload.CheckCompatibilityMode;
            templatedSubjectSeance.UploadPassword = ""; //TODO
            templatedSubjectSeance.ExpirationDate = session.Upload.ExpirationDate;
            templatedSubjectSeance.MailPath = license.Mail;
            templatedSubjectSeance.Login = license.Login;
            templatedSubjectSeance.Password = license.Password;
            templatedSubjectSeance.MinTimeBetweenConnexions = session.Upload.MinTimeBetweenConnexions;
            templatedSubjectSeance.Culture = Framework.LocalizationManager.GetDisplayLanguage();
            if (session.Upload.ServerCode) {
                templatedSubjectSeance.ServerCode = session.Upload.ServerCode;
            }
            return templatedSubjectSeance;
        }

    }

    export class Access {
        public SubjectCode: string;
        public Password: string;
        public ServerCode: string;
        public ListAuthorizedDates: Date[];
        public MinTimeBetweenConnexions: number;
        //public Anonymous: boolean;
        public AnonymousForcedMail: boolean;
        public AnonymousMode: string;
        public LocalSession: boolean;


    }

    export class Data {
        public DataControlId: number;
        public ControlName: string;
        public Type: string;
        public Replicate: number = 1;
        public Intake: number = 1;
        public SubjectCode: string;
        public ProductCode: string;
        public AttributeCode: string;
        public Time: number;
        public StandardizedTime: number;
        public Duration: Number;
        public Score: number;
        public ProductRank: number;
        public AttributeRank: number;
        public RecordedDate: Date;
        public Session: number;
        public X: number;
        public Y: number;
        public QuestionLabel: string;
        public Group: string;
        public Description: string;
        //public State: DataStateTypeEnum;

        public Status: string; // Downloaded, Imported, Imputed, Updated, Computed, Deleted, Inserted //TODO

        public SheetName: string = ""; // Pour le découpage en onglet dans DataView

        public static Create(dtype: string, subjectCode: string, productCode: string, attributeCode: string, replicate: number = 1, intake: number = 1, score: number = 0, time: number = 0): Models.Data {
            let d = new Models.Data();
            d.Type = dtype;
            d.SubjectCode = subjectCode;
            d.ProductCode = productCode;
            d.AttributeCode = attributeCode;
            d.Replicate = replicate;
            d.Intake = intake;
            d.Score = score;
            d.Time = time;
            return d;
        }

        constructor() {
            if (this.DataControlId) {
                this.ControlName = this.DataControlId.toString();
            }
        }

        public static GetType(d: Data): string {
            if (Number(d.Type) > 0) {
                return DataType[d.Type];
            }
            return d.Type;
        }

        //public static GetState(d: Data): string {
        //    return DataStateTypeEnum[d.State];
        //}

        // Templates d'import
        public static ImportTemplates: string[] = [
            "Profile", "ExtendedProfile", "TDS", "TDSByDuration", "TDSByColumn", "Hedonic", "ExtendedHedonic", /*"ITIP"*/, /*"PSP"*/, /*"Question"*/, "Sorting", "Napping", "TriangleTest", "ProgressiveProfile", "Ranking", /*"Event"*/, "CATA", "TCATA", "TCATAByDuration", "TCATAByColumn", "DynamicLiking", "FlashProfile", /*"LongitudinalProfile"*/, "ProgressiveLiking", "DynamicProfile", /*"AlternatedProfile"*/, "TI", /*"Emotion"*/, "FreeTextQuestion", "MultipleAnswersQuestion", "SingleAnswerQuestion"
        ];

        public static GetImportTemplate(dataType: string): Framework.ImportManager.Template {
            //TODO en fonction de datatype
            let template: Framework.ImportManager.Template = new Framework.ImportManager.Template();
            template.Name = "Data";
            template.ColumnTemplates = [
                { AttributeName: "Session", Synonyms: ["session"], IsImperative: false, Description: Framework.LocalizationManager.Get("Session"), Type: Number, ColumnName: "" },
                { AttributeName: "Replicate", Synonyms: ["replicate", "rep"], IsImperative: false, Description: Framework.LocalizationManager.Get("Replicate"), Type: Number, ColumnName: "" },
                { AttributeName: "Intake", Synonyms: ["intake", "bite"], IsImperative: false, Description: Framework.LocalizationManager.Get("Intake"), Type: Number, ColumnName: "" },
                { AttributeName: "SubjectCode", Synonyms: ["subject", "subjectcode", "panellist", "panelist"], IsImperative: true, Description: Framework.LocalizationManager.Get("SubjectCode"), Type: String, ColumnName: "" },
                { AttributeName: "ProductCode", Synonyms: ["product", "productcode"], IsImperative: true, Description: Framework.LocalizationManager.Get("ProductCode"), Type: String, ColumnName: "" },

            ];

            if (dataType == "Profile" || dataType == "Hedonic" || dataType == "CATA" || dataType == "TCATA" || dataType == "DynamicLiking" || dataType == "DynamicProfile" || dataType == "ProgressiveLiking" || dataType == "ProgressiveProfile" || dataType == "TI" ) {
                template.ColumnTemplates.push({ AttributeName: "Score", Synonyms: ["score", "intensity"], IsImperative: true, Description: Framework.LocalizationManager.Get("Score"), Type: Number, ColumnName: "" })
            }

            if (dataType == "TDS" || dataType == "Profile" || dataType == "Hedonic" || dataType == "CATA" || dataType == "TCATA" || dataType == "DynamicLiking" || dataType == "DynamicProfile" || dataType == "ProgressiveLiking" || dataType == "ProgressiveProfile" || dataType == "TI") {
                template.ColumnTemplates.push({ AttributeName: "AttributeCode", Synonyms: ["attribute", "attributecode", "descriptor"], IsImperative: true, Description: Framework.LocalizationManager.Get("AttributeCode"), Type: String, ColumnName: "" });
            }

            if (dataType == "TDS" || dataType == "TCATA" || dataType == "DynamicLiking" || dataType == "DynamicProfile") {
                template.ColumnTemplates.push({ AttributeName: "Time", Synonyms: ["time", "temps"], IsImperative: true, Description: Framework.LocalizationManager.Get("Time"), Type: Number, ColumnName: "" });
            }

            if (dataType == "FreeTextQuestion" || dataType == "MultipleAnswersQuestion" || dataType == "SingleAnswerQuestion") {
                template.ColumnTemplates.push({ AttributeName: "QuestionLabel", Synonyms: ["question"], IsImperative: true, Description: Framework.LocalizationManager.Get("Question"), Type: Number, ColumnName: "" });
                template.ColumnTemplates.push({ AttributeName: "Description", Synonyms: ["description", "answer"], IsImperative: true, Description: Framework.LocalizationManager.Get("Answer"), Type: Number, ColumnName: "" });
            }            

            return template;
        }

        // Paramètres pour le tableau croisé dynamique
        public static TCDParameters = [
            { Template: "Profile", Rows: ["SubjectCode", "Session", "Replicate", "ProductCode"], Cols: ["AttributeCode"], Vals: ["Score"], Aggregator: "Count" },
            { Template: "RegularTDS", Rows: ["SubjectCode"], Cols: ["Session", "Replicate", "ProductCode"], Vals: ["Time"], Aggregator: "Count" },
            { Template: "MultipleIntakesTDS", Rows: ["SubjectCode"], Cols: ["Session", "Replicate", "Intake", "ProductCode"], Vals: ["Time"], Aggregator: "Count" }
        ]; //TODO

        public static GetColumns(dataType: string): string[] {

            //TODO : utilsier plutot nom du template pour dissocier TDS / TDS intake ?
            // TODO : compléter

            let res: string[] = [];
            //if (dataType == "Profile") {
            //    res = ["Session", "Replicate", "ProductCode", "SubjectCode", "AttributeCode", "Score"];
            //}
            //if (dataType == "TDS") {
            //    res = ["Session", "Replicate", "ProductCode", "SubjectCode", "AttributeCode", "Score", "Time"];
            //}

            res = Data.GetImportTemplate(dataType).ColumnTemplates.map((x) => { return x.AttributeName; });

            return res;
        }

        public static ToString(d: Data): string {
            let res: string = "";
            let columns = Data.GetColumns(Data.GetType(d));
            columns.forEach((col) => {
                res += d[col] + ";";
            });

            if (d["ByVariable"]) {
                res += d["ByVariable"] + ";";
            }
            res = res.slice(0, -1);
            return res;
        }

        public static GetCanonicalDataTableParameters(listData: Models.Data[], onChange: (data: Models.Data, propertyName: string, oldValue: string, newValue: string) => void): Framework.Form.DataTableParameters {

            let dataDataTableParameters = new Framework.Form.DataTableParameters();

            let dataColumns = [];

            let selectedDataType = Data.GetType(listData[0]);


            dataColumns.push({ data: "Session", title: Framework.LocalizationManager.Get("Session") });
            dataColumns.push({ data: "SubjectCode", title: Framework.LocalizationManager.Get("Subject") });
            dataColumns.push({ data: "ProductCode", title: Framework.LocalizationManager.Get("Product") });
            if (selectedDataType != "SpeechToText") {
                dataColumns.push({ data: "AttributeCode", title: Framework.LocalizationManager.Get("Attribute") });
            }

            dataColumns.push({ data: "Replicate", title: Framework.LocalizationManager.Get("Replicate") });
            dataColumns.push({
                data: "Intake", title: Framework.LocalizationManager.Get("Intake"), render: function (data, type, row) {
                    if (type === 'display') {
                        if (data == undefined || data == null) {
                            return "1";
                        }
                        return data;
                    }
                    return "";
                }
            });
            if (selectedDataType != "Question" && selectedDataType != "FreeTextQuestion" && selectedDataType != "SingleAnswerQuestion" && selectedDataType != "MultipleAnswersQuestion") {
                dataColumns.push({
                    data: "Score", title: Framework.LocalizationManager.Get("Score")
                });
            }
            dataColumns.push({
                data: "ControlName", title: Framework.LocalizationManager.Get("ControlName")
            });

            if (selectedDataType == "TDS" || selectedDataType == "Event" || selectedDataType == "Emotion") {
                dataColumns.push({ data: "Time", title: Framework.LocalizationManager.Get("Time") });
                dataColumns.push({
                    data: "StandardizedTime", title: Framework.LocalizationManager.Get("StandardizedTime")
                });
                dataColumns.push({
                    data: "Duration", title: Framework.LocalizationManager.Get("Duration")
                });
            }

            if (selectedDataType == "Sentiment" || selectedDataType == "Question" || selectedDataType == "FreeTextQuestion" || selectedDataType == "SingleAnswerQuestion" || selectedDataType == "MultipleAnswersQuestion") {
                dataColumns.push({ data: "QuestionLabel", title: Framework.LocalizationManager.Get("Label") });
            }

            if (selectedDataType == "Sentiment" || selectedDataType == "Question" || selectedDataType == "FreeTextQuestion" || selectedDataType == "SpeechToText" || selectedDataType == "SingleAnswerQuestion" || selectedDataType == "MultipleAnswersQuestion") {
                dataColumns.push({ data: "Description", title: Framework.LocalizationManager.Get("Description") });
            }

            dataDataTableParameters.OnCreatedRow = (row, data, index) => {
                if (data.Status == "Imputed" || data.Status == "Inserted") {
                    $('td', row).css('background', 'LemonChiffon');
                }
                if (data.Status == "Updated") {
                    $('td', row).css('background', 'PapayaWhip');
                }
                if (data.Status == "Computed") {
                    $('td', row).css('background', 'PeachPuff');
                }
                if (data.Status == "Imported") {
                    $('td', row).css('background', 'PaleGoldenrod');
                }
                if (data.Status == "Deleted") {
                    $('td', row).css('background', 'Red');
                }
            }

            dataDataTableParameters.OnEditCell = (propertyName: string, data) => {
                return Framework.Form.InputText.Create(data[propertyName], (x) => {
                    data[propertyName] = x;
                    data.Status = "Updated";
                }, Framework.Form.Validator.NoValidation(), false, ["tableInput"]).HtmlElement;
            }

            dataDataTableParameters.ListData = listData;
            dataDataTableParameters.ListColumns = dataColumns;
            dataDataTableParameters.Order = [[0, 'desc']];  //TODO : hauteur
            dataDataTableParameters.OnDataChanged = (data, propertyName, oldValue, newValue) => {
                onChange(data, propertyName, oldValue, newValue);
            };

            return dataDataTableParameters;
        }

        public static GetExtendedDataTableParameters(listData: Models.Data[]): Framework.Form.DataTableParameters {
            let dataDataTableParameters = new Framework.Form.DataTableParameters();

            let dataColumns = [];

            let selectedDataType = Models.Data.GetType(listData[0]);

            dataColumns = [
                { data: "Session", title: Framework.LocalizationManager.Get("Session") },
                { data: "Replicate", title: Framework.LocalizationManager.Get("Replicate") },
                { data: "Intake", title: Framework.LocalizationManager.Get("Intake") },
                { data: "Subject", title: Framework.LocalizationManager.Get("SubjectCode") },
                { data: "Product", title: Framework.LocalizationManager.Get("ProductCode") }
            ];

            //// TODO : durées cumulées ?

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

            let datasetSummary: PanelLeaderModels.DatasetSummary = new PanelLeaderModels.DatasetSummary(listData);



            // Si profil, hédonique...

            datasetSummary.Attributes.forEach((x, i) => {
                dataColumns.push({
                    data: "AttributesScores", title: x, render: function (data, type, row) {
                        if (type === 'display') {
                            if (data == undefined) {
                                return "<span style='background:red'>-</span>";
                            }
                            let res;
                            if (selectedDataType == "TDS") {
                                res = (<PanelLeaderModels.FlatContingencyTableRow>row).AttributesCounts.Entries.filter((e) => { return e.Key == x });
                            } else {
                                res = (<PanelLeaderModels.FlatContingencyTableRow>row).AttributesScores.Entries.filter((e) => { return e.Key == x });
                            }
                            //return data[i];
                            if (res.length > 0 && res[0].Val) {
                                return res[0].Val;
                            }
                            return 0;
                        }
                        return "";
                    }
                });
            });

            dataDataTableParameters.ListData = datasetSummary.FlatContingencyTable;
            dataDataTableParameters.ListColumns = dataColumns;
            dataDataTableParameters.Order = [[0, 'desc']];

            dataDataTableParameters.OnSelectionChanged = (sel: Models.Data[]) => {
                //self.btnDeleteSelectedData.CheckState();
                //TODO
            }

            dataDataTableParameters.OnCreatedRow = (row, data, index) => {
                //if (data.Status == "Imputed") {
                //    $('td', row).css('background', 'orange');
                //}
            }

            dataDataTableParameters.OnEditCell = (propertyName: string, data) => {
                //TODO
            }

            return dataDataTableParameters;
        }

        public static GetDataTable(data: Data[]): Framework.Form.Table<Models.Data> {

            
            let selectedDataType = Models.Data.GetType(data[0]);
            


            let TableData = new Framework.Form.Table<Models.Data>();
            TableData.ListColumns = [];

            let col1 = new Framework.Form.TableColumn();
            col1.Name = "Session";
            col1.Title = Framework.LocalizationManager.Get("Session");
            col1.RemoveSpecialCharacters = true;
            col1.MinWidth = 100;
            TableData.ListColumns.push(col1);

            let col5 = new Framework.Form.TableColumn();
            col5.Name = "Replicate";
            col5.Title = Framework.LocalizationManager.Get("Replicate");
            col5.Type = "integer";
            col5.DefaultValue = 1;
            col5.MinWidth = 100;
            TableData.ListColumns.push(col5);

            let col6 = new Framework.Form.TableColumn();
            col6.Name = "Intake";
            col6.Title = Framework.LocalizationManager.Get("Intake");
            col6.Type = "positiveInteger";
            col6.DefaultValue = 1;
            col6.MinWidth = 100;
            TableData.ListColumns.push(col6);

            let col2 = new Framework.Form.TableColumn();
            col2.Name = "SubjectCode";
            col2.Title = Framework.LocalizationManager.Get("Subject");
            col2.RemoveSpecialCharacters = true;
            col2.MinWidth = 100;
            TableData.ListColumns.push(col2);

            let col3 = new Framework.Form.TableColumn();
            col3.Name = "ProductCode";
            col3.Title = Framework.LocalizationManager.Get("Product");
            col3.RemoveSpecialCharacters = true;
            col3.MinWidth = 100;
            TableData.ListColumns.push(col3);



            TableData.ListData = data;

            if (selectedDataType != "SpeechToText") {
                let col4 = new Framework.Form.TableColumn();
                col4.Name = "AttributeCode";
                col4.Title = Framework.LocalizationManager.Get("Attribute");
                col4.RemoveSpecialCharacters = true;
                col4.MinWidth = 100;
                TableData.ListColumns.push(col4);
            }

            if (selectedDataType != "Question" && selectedDataType != "FreeTextQuestion" && selectedDataType != "SingleAnswerQuestion") {
                let col7 = new Framework.Form.TableColumn();
                col7.Name = "Score";
                col7.Title = Framework.LocalizationManager.Get("Score");
                col7.Type = "number";
                col7.MinWidth = 100;
                TableData.ListColumns.push(col7);
            }

            let col8 = new Framework.Form.TableColumn();
            col8.Name = "ControlName";
            col8.Title = Framework.LocalizationManager.Get("ControlName");
            col8.RemoveSpecialCharacters = true;
            col8.MinWidth = 100;
            TableData.ListColumns.push(col8);


            

            if (selectedDataType == "TDS" || selectedDataType == "Event" || selectedDataType == "Emotion" || selectedDataType == "TCATA" || selectedDataType == "DynamicProfile") {

                let col9 = new Framework.Form.TableColumn();
                col9.Name = "Time";
                col9.Title = Framework.LocalizationManager.Get("Time");
                col9.Type = "number";
                col9.MinWidth = 100;
                TableData.ListColumns.push(col9);

                //let col9 = new Framework.Form.TableColumn();
                //col9.Name = "StandardizedTime";
                //col9.Title = Framework.LocalizationManager.Get("StandardizedTime");
                //col9.Type = "number";
                //col9.MinWidth = 100;
                //col9.RenderFunction = (val: number) => {
                //    if (val == undefined) {
                //        return "";
                //    }
                //    return val.toString();
                //};
                //TableData.ListColumns.push(col9);

                //let col10 = new Framework.Form.TableColumn();
                //col10.Name = "Duration";
                //col10.Title = Framework.LocalizationManager.Get("Duration");
                //col10.Type = "number";
                //col10.MinWidth = 100;
                //col10.RenderFunction = (val: number) => {
                //    if (val == undefined) {
                //        return "";
                //    }
                //    return val.toString();
                //};
                //TableData.ListColumns.push(col10);
            }

            if (selectedDataType == "Sentiment" || selectedDataType == "Question" || selectedDataType == "FreeTextQuestion" || selectedDataType == "SingleAnswerQuestion" || selectedDataType == "MultipleAnswersQuestion") {
                let col11 = new Framework.Form.TableColumn();
                col11.Name = "QuestionLabel";
                col11.Title = Framework.LocalizationManager.Get("Label");
                col11.RemoveSpecialCharacters = true;
                TableData.ListColumns.push(col11);
            }

            if (selectedDataType == "Sentiment" || selectedDataType == "Question" || selectedDataType == "FreeTextQuestion" || selectedDataType == "SpeechToText" || selectedDataType == "SingleAnswerQuestion" || selectedDataType == "MultipleAnswersQuestion" || selectedDataType == "Sorting") {

                let col12 = new Framework.Form.TableColumn();
                col12.Name = "Description";
                col12.Title = Framework.LocalizationManager.Get("Description");
                TableData.ListColumns.push(col12);
            }

            //let col13 = new Framework.Form.TableColumn();
            //col13.Name = "Status";
            //col13.Title = Framework.LocalizationManager.Get("Status");
            //col13.Editable = false;
            //col13.MinWidth = 100;
            //TableData.ListColumns.push(col13);

            let col14 = new Framework.Form.TableColumn();
            col14.Name = "RecordedDate";
            col14.Title = Framework.LocalizationManager.Get("Date");
            col14.Editable = false;
            col14.MinWidth = 100;
            col14.RenderFunction = (val, row) => { return new Date(val).toLocaleString(); };
            TableData.ListColumns.push(col14);

            return TableData;
        }

        public static GetExtendedDataTable(data: Data[]): Framework.Form.Table<PanelLeaderModels.FlatContingencyTableRow> {


            let selectedDataType = Models.Data.GetType(data[0]);

            let TableData = new Framework.Form.Table<PanelLeaderModels.FlatContingencyTableRow>();
            TableData.ListColumns = [];

            let col1 = new Framework.Form.TableColumn();
            col1.Name = "Session";
            col1.Title = Framework.LocalizationManager.Get("Session");
            col1.RemoveSpecialCharacters = true;
            col1.MinWidth = 100;
            TableData.ListColumns.push(col1);

            let col5 = new Framework.Form.TableColumn();
            col5.Name = "Replicate";
            col5.Title = Framework.LocalizationManager.Get("Replicate");
            col5.Type = "integer";
            col5.DefaultValue = 1;
            col5.MinWidth = 100;
            TableData.ListColumns.push(col5);

            let col6 = new Framework.Form.TableColumn();
            col6.Name = "Intake";
            col6.Title = Framework.LocalizationManager.Get("Intake");
            col6.Type = "positiveInteger";
            col6.DefaultValue = 1;
            col6.MinWidth = 100;
            TableData.ListColumns.push(col6);

            let col2 = new Framework.Form.TableColumn();
            col2.Name = "SubjectCode";
            col2.Title = Framework.LocalizationManager.Get("Subject");
            col2.RemoveSpecialCharacters = true;
            col2.MinWidth = 100;
            TableData.ListColumns.push(col2);

            let col3 = new Framework.Form.TableColumn();
            col3.Name = "ProductCode";
            col3.Title = Framework.LocalizationManager.Get("Product");
            col3.RemoveSpecialCharacters = true;
            col3.MinWidth = 100;
            TableData.ListColumns.push(col3);


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

            let datasetSummary: PanelLeaderModels.DatasetSummary = new PanelLeaderModels.DatasetSummary(data);
            TableData.ListData = datasetSummary.FlatContingencyTable;

            // Si profil, hédonique...
            datasetSummary.Attributes.forEach((x, i) => {

                let col = new Framework.Form.TableColumn();
                col.Name = "AttributesScores";
                col.Title = x;
                col.Type = "number";
                col.MinWidth = 100;
                col.Editable = false;
                col.Filterable = false;
                col.RenderFunction = (y) => {
                    if (y == undefined) {
                        return "<span style='background:red'>-</span>";
                    }
                    let res;
                    if (selectedDataType == "TDS") {
                        res = y.Entries.filter((e) => { return e.Key == x });
                    } else {
                        res = y.Entries.filter((e) => { return e.Key == x });
                    }
                    if (res.length > 0 && res[0].Val != undefined) {
                        return res[0].Val;
                    }
                    return "0";
                }
                TableData.ListColumns.push(col);

            });



            return TableData;
        }

    }

    export class Progress {
        public ListData: Data[];
        public CurrentState: State = new State();
        public Notification: string;
        public ShowSubjectCodeOnClient: string;
        public DisplayedScreenIndex: number[] = [];

        public GetKey(): string {
            return this.CurrentState.ServerCode + "_" + this.CurrentState.SubjectCode;
        }

        public GetData(subjectCode: string, productCode: string, attributeCode: string, replicate: number = 1, intake: number = 1): Models.Data[] {
            return this.ListData.filter((x) => { return x.SubjectCode == subjectCode && x.Replicate == replicate && x.Intake == intake && x.ProductCode == productCode && x.AttributeCode == attributeCode });
        }
    }

    export class Subject extends Framework.Database.DBItem {

        public Code: string = "";
        public FirstName: string = "";
        public LastName: string = "";
        public Password: string = "";
        public Country: string = "";
        public Mail: string = "";
        public Phone: string = "";
        public City: string = "";
        public Address: string = "";
        public BirthDate: Date;
        public Gender: string = "";
        public EducationLevel: string = "";
        public ProfessionalActivity: string = "";
        public FamilialStatus: string = "";
        public Notes: string = "";
        public URL: string = "";

        // Supprimer
        public static GetDataTableParameters(listSubjects: Models.Subject[], additionalFields: PanelLeaderModels.DBField[], onChange: (subject: Models.Subject, propertyName: string, oldValue: string, newValue: string) => void): Framework.Form.DataTableParameters {

            let subjectsColumns = [
                { data: "Code", title: Framework.LocalizationManager.Get("Code"), render: undefined }, //OK
                { data: "FirstName", title: Framework.LocalizationManager.Get("FirstName") }, //OK
                { data: "LastName", title: Framework.LocalizationManager.Get("LastName") }, //OK
                { data: "Password", title: Framework.LocalizationManager.Get("Password") }, //OK
                { data: "Country", title: Framework.LocalizationManager.Get("Country") }, //OK
                { data: "Mail", title: Framework.LocalizationManager.Get("Mail") }, //OK
                { data: "Phone", title: Framework.LocalizationManager.Get("Phone") },//OK
                { data: "City", title: Framework.LocalizationManager.Get("City") }, //OK
                { data: "Address", title: Framework.LocalizationManager.Get("Address") }, //OK
                //TODO{ data: "BirthDate", title: Localization.Get("BirthDate") },
                { data: "Gender", title: Framework.LocalizationManager.Get("Gender") },
                { data: "Notes", title: Framework.LocalizationManager.Get("Notes") }, //OK
                { data: "URL", title: Framework.LocalizationManager.Get("URL") } //OK
            ];

            PanelLeaderModels.DBField.ExtendDataTableColumnsWithDBFields(additionalFields, subjectsColumns);

            // Propriétés modifiables à l'aide d'un input texte, sans validation
            let inputProperties = ["FirstName", "LastName", "Password", "City", "Address", "Notes", "Phone"];

            let subjectDataTableParameters = new Framework.Form.DataTableParameters();
            subjectDataTableParameters.ListData = listSubjects;
            subjectDataTableParameters.ListColumns = subjectsColumns;
            subjectDataTableParameters.Order = [[1, 'asc']];
            subjectDataTableParameters.Paging = false;
            subjectDataTableParameters.OnDataChanged = (data, propertyName, oldValue, newValue) => {
                onChange(data, propertyName, oldValue, newValue);
            };
            subjectDataTableParameters.OnEditCell = (propertyName, data) => {

                if (propertyName == "Country") {
                    return Framework.Form.Select.Render(data["Country"], Framework.KeyValuePair.FromArray(Framework.Enums.CountryEnum), Framework.Form.Validator.NotEmpty(), (x) => {
                        data["Country"] = x;
                    }, false).HtmlElement;
                }
                if (propertyName == "Gender") {
                    return Framework.Form.Select.Render(data["Gender"], Models.GetListGenders(), Framework.Form.Validator.NotEmpty(), (x) => {
                        data["Gender"] = x;
                    }, false).HtmlElement;
                }
                if (propertyName == "Code") {
                    return Framework.Form.InputText.Create(data["Code"], (x, y) => {

                        //TODO
                        //oldCode = data["Code"];
                        //data["Code"] = Framework.Form.Validator.RemoveSpecialCharacters(x);
                        //TODO self.controller.Session.UpdateProduct(data, oldCode);

                        if (y.IsValid == true) {
                            data["Code"] = x;
                        }
                    }, Framework.Form.Validator.Unique(listSubjects.map(a => a.Code))).HtmlElement;
                }
                if (propertyName == "Mail") {
                    return Framework.Form.InputText.Create(data["Mail"], (x, y) => {
                        if (y.IsValid == true) {
                            data["Mail"] = x;
                        }
                    }, Framework.Form.Validator.Mail()).HtmlElement;
                }
                if (inputProperties.indexOf(propertyName) > -1) {
                    return Framework.Form.InputText.Create(data[propertyName], (x) => {
                        data[propertyName] = x;
                    }, Framework.Form.Validator.NoValidation()).HtmlElement;
                }

                let fields = additionalFields.map((x) => { return "Custom" + x.ID });
                if (fields.indexOf(propertyName) > -1) {
                    let field = additionalFields.filter((x) => { return "Custom" + x.ID == propertyName })[0];
                    //TODO : toujours utiliser ça pour définir les contenu des cellules
                    return PanelLeaderModels.DBField.OnEditDataTableCellWithDBFields(field, data, propertyName);
                }

            }

            return subjectDataTableParameters;

        }

        public static GetImportTemplate(): Framework.ImportManager.Template {

            let template: Framework.ImportManager.Template = new Framework.ImportManager.Template();
            template.Name = "Subject";
            template.ColumnTemplates = [
                { AttributeName: "Code", Synonyms: ["code"], IsImperative: true, Description: Framework.LocalizationManager.Get("Subject"), Type: String, ColumnName: "" },
                { AttributeName: "FirstName", Synonyms: ["firstname", "prenom", "prénom"], IsImperative: false, Description: Framework.LocalizationManager.Get("FirstName"), Type: String, ColumnName: "" },
                { AttributeName: "LastName", Synonyms: ["lastname", "nom"], IsImperative: false, Description: Framework.LocalizationManager.Get("LastName"), Type: String, ColumnName: "" },
                { AttributeName: "Password", Synonyms: ["password", "pwd", "mot de passe"], IsImperative: false, Description: Framework.LocalizationManager.Get("Password"), Type: String, ColumnName: "" },
                { AttributeName: "Country", Synonyms: ["country", "pays"], IsImperative: false, Description: Framework.LocalizationManager.Get("Country"), Type: String, ColumnName: "" },
                { AttributeName: "Mail", Synonyms: ["mail", "email", "e-mail"], IsImperative: false, Description: Framework.LocalizationManager.Get("Mail"), Type: String, ColumnName: "" },
                { AttributeName: "Phone", Synonyms: ["phone", "phone number", "téléphone", "telephone", "tél", "tel"], IsImperative: false, Description: Framework.LocalizationManager.Get("Phone"), Type: String, ColumnName: "" },
                { AttributeName: "City", Synonyms: ["city", "ville"], IsImperative: false, Description: Framework.LocalizationManager.Get("City"), Type: String, ColumnName: "" },
                { AttributeName: "Address", Synonyms: ["address", "adresse"], IsImperative: false, Description: Framework.LocalizationManager.Get("Address"), Type: String, ColumnName: "" },
                { AttributeName: "BirthDate", Synonyms: ["birthdate", "birth date", "date de naissance"], IsImperative: false, Description: Framework.LocalizationManager.Get("BirthDate"), Type: Date, ColumnName: "" },
                { AttributeName: "Gender", Synonyms: ["gender", "genre", "sexe"], IsImperative: false, Description: Framework.LocalizationManager.Get("Gender"), Type: String, ColumnName: "" },
            ];

            return template;
        }
    }

    export class State {
        public CurrentScreen: number;
        public CountScreen: number;
        public PanellistHasFinished: boolean;
        public MustBeDownloaded: boolean;
        public LastAccess: Date;
        public SubjectCode: string;
        public OS: string;
        public Browser: string;
        public Geolocation: string;
        public Issue: string;
        public ServerCode: string;
        public MailStatus: string;
        public LastDownload: Date;
        public LastUpload: Date;
        //public LastAction: ActionTypeEnum;
    }

    export class LocalSessionProgress {
        public Key: string;
        public ServerCode: string;
        public SubjectCode: string;
        public LastAccess: string;
        public LastDownload: string;
        public Screen: string;
        public Data: string;
        public Size: string;
        public Progress: Progress;

        public static GetDataTableParameters(progresses: Models.LocalSessionProgress[]): Framework.Form.DataTableParameters {

            let columns = [
                { data: "ServerCode", title: Framework.LocalizationManager.Get("ServerCode") },
                { data: "SubjectCode", title: Framework.LocalizationManager.Get("SubjectCode") },
                { data: "LastAccess", title: Framework.LocalizationManager.Get("LastAccess") },
                { data: "LastDownload", title: Framework.LocalizationManager.Get("LastDownload") },
                { data: "Screen", title: Framework.LocalizationManager.Get("Progress") },
                { data: "Data", title: Framework.LocalizationManager.Get("Data") },
                { data: "Size", title: Framework.LocalizationManager.Get("Size") },
            ];

            let dataTableParameters = new Framework.Form.DataTableParameters();
            dataTableParameters.ListData = progresses;
            dataTableParameters.ListColumns = columns;
            dataTableParameters.ScrollY = "30vh";
            dataTableParameters.Order = [[0, 'desc']];
            //dataTableParameters.OnSelectionChanged = (listSelectedProgresses: Models.LocalSessionProgress[]) => {
            //    self.selectedProgresses = listSelectedProgresses.map(x => x.Progress);
            //    self.btnSynchronizeLocalSessions.CheckState();
            //    self.btnZipLocalSessions.CheckState();
            //    self.btnDeleteLocalSessions.CheckState();
            //    self.btnResetLocalSessions.CheckState();
            //};

            //Framework.Form.DataTable.Register('tableLocalSessions', dataTableParameters, (table) => {
            //    self.tableLocalSessions = table;
            //});

            return dataTableParameters;
        }
    }

    export class Screen {

        public Id: number;
        public ExperimentalDesignId: number;
        public ListConditions: Condition;
        public Resolution: string;
        public IsConditionnal: boolean = false;
        public XamlContent: string; //TODO : ne plus enregistrer

        public Ratio: number = 1;

        // Rajouté pour V2 (remplace XAMLContent)
        public Background: string;
        public Controls: ScreenReader.Controls.BaseControl[]; // Pas sérialisé

        private container: HTMLDivElement;

        public ProgressBarPosition: string = "NoProgressBar";
        public ProgressBarType: string = "Numeric";
        //public DefaultStyle: Framework.KeyValuePair[] = [];

        public OnSelectionChanged: Function;

        public static Height: number = 1000;

        public static Resolutions: string[] = ["1:1", "4:3", "16:9", "16:10"];

        public get Container(): HTMLDivElement {
            return this.container;
        }

        public static Width(screen: Screen): number {
            if (screen.Resolution == "1:1") {
                return 1000;
            }
            if (screen.Resolution == "4:3") {
                return 1333;
            }
            if (screen.Resolution == "16:9") {
                return 1777;
            }
            if (screen.Resolution == "16:10") {
                return 1600;
            }
            return 1000;
        }

        constructor() {
            this.Controls = [];
            this.IsConditionnal = false;
            this.ListConditions = new Condition();
        }

        public static ChangeResolution(screen: Models.Screen, resolution: string) {
            let self = this;
            let resizeRatio = PanelLeaderModels.DefaultScreenOptions.GetResolutionRatio(resolution) / PanelLeaderModels.DefaultScreenOptions.GetResolutionRatio(screen.Resolution);


            screen.Resolution = resolution;
            screen.Controls.forEach((c) => {
                c._Left *= resizeRatio;
                //c._Top *= resizeRatio;
                //c._Height *= resizeRatio;
                c._Width *= resizeRatio;

            });

        }

        public static HasSpeechToText(screen: Screen): boolean {
            return (screen.Controls.filter((x) => { return x._Type == "SpeechToText" && (<ScreenReader.Controls.SpeechToText>x)._RecognitionLanguage != "None" })).length > 0;
        }

        public static SetProgressBar(screen: Screen, position: string, ptype: string, currentScreenIndex: number, lastScreenIndex: number) {

            screen.ProgressBarPosition = position;
            screen.ProgressBarType = ptype;

            // Suppression des progressbar
            let progressbars = screen.Controls.filter((x) => { return x._Type == "CustomProgressBar"; });
            progressbars.forEach((y) => {
                Models.Screen.RemoveControl(screen, y);
            });

            if (position == "NoProgressBar" || ptype == "None") {
                return;
            }

            let pb: ScreenReader.Controls.CustomProgressBar = new ScreenReader.Controls.CustomProgressBar();
            pb._Height = 50;
            pb._Width = 100;
            pb.CurrentScreenIndex = currentScreenIndex;
            pb.LastScreenIndex = lastScreenIndex;
            pb._DisplayMode = ptype;

            let v = "Top";
            let h = "Left";

            if (position.indexOf("Top") > -1) {
                v = "Top";
            }

            if (position.indexOf("Bottom") > -1) {
                v = "Bottom";
            }

            if (position.indexOf("Left") > -1) {
                h = "Left";
            }

            if (position.indexOf("Right") > -1) {
                h = "Right";
            }

            if (position.indexOf("Center") > -1) {
                h = "Center";
            }

            Models.Screen.AddControlStatic(screen, pb, v, h)



        }

        //public static ReadXAML(xaml: string): Element {
        //    // Lit XAMLContent d'un écran
        //    try {
        //        var xmlDoc: XMLDocument = $.parseXML(xaml);
        //        var canvas: Element = <Element>xmlDoc.getElementsByTagName('Canvas')[0]
        //        return canvas
        //    }
        //    catch (ex) {
        //        return null;
        //    }
        //}

        public static GetListResolutions(): Framework.KeyValuePair[] {
            let res = [];
            res.push(new Framework.KeyValuePair('1:1', '1:1'));
            res.push(new Framework.KeyValuePair('4:3', '4:3'));
            res.push(new Framework.KeyValuePair('16:9', '16:9'));
            res.push(new Framework.KeyValuePair('16:10', '16:10'));
            return res;
        }

        private static buttonHeight: number = 80;
        private static buttonWidth: number = 250;

        private static createScreen(id: number, templatedScreen: PanelLeaderModels.TemplatedScreen): Models.Screen {

            let screen: Models.Screen = new Models.Screen();
            screen.Id = id;
            screen.ExperimentalDesignId = templatedScreen.ScreenExperimentalDesignId;
            screen.Resolution = templatedScreen.DefaultScreenOptions.Resolution;
            screen.Background = templatedScreen.DefaultScreenOptions.ScreenBackground;
            screen.ProgressBarPosition = templatedScreen.DefaultScreenOptions.ProgressBarPosition;
            screen.ProgressBarType = templatedScreen.DefaultScreenOptions.ProgressBar;

            if (templatedScreen.Title && templatedScreen.Title.length > 0) {
                let txt = ScreenReader.Controls.TextArea.Create(Framework.LocalizationManager.Get(templatedScreen.Title, templatedScreen.DefaultScreenOptions.Language), 100, 400);
                txt.SetStyle(templatedScreen.DefaultScreenOptions.DefaultStyle);
                screen.AddControl(txt, "Top", "Center");
            }

            if (templatedScreen.NextScreen == "ClickOnNextButton") {
                let btn = ScreenReader.Controls.CustomButton.Create(Framework.LocalizationManager.Get("SessionTemplate_GoToNextPage", templatedScreen.DefaultScreenOptions.Language), "GoToNextPage", Screen.buttonHeight, Screen.buttonWidth);
                btn.SetStyle(templatedScreen.DefaultScreenOptions.DefaultStyle);
                screen.AddControl(btn, "Bottom", "Right");
            }

            if (templatedScreen.NextScreen == "WhenTimerElapsed") {
                let control = ScreenReader.Controls.CustomTimer.Create("Visible", 60);
                screen.AddControl(control, "Top", "Right");
            }

            if (screen.ProgressBarType != "None") {
                Screen.SetProgressBar(screen, screen.ProgressBarPosition, screen.ProgressBarType, 0, 0);
            }

            //TODO : progressbar i/j


            return screen;
        }

        public static CreateScreenWithContent(id: number, templatedScreen: PanelLeaderModels.TemplatedScreenWithContent): Models.Screen {
            let screen: Models.Screen = Screen.createScreen(id, templatedScreen);

            if (templatedScreen.Content && templatedScreen.Content.length > 0) {
                let txt = ScreenReader.Controls.TextArea.Create(Framework.LocalizationManager.Get(templatedScreen.Content, templatedScreen.DefaultScreenOptions.Language), 400, 400);
                txt.SetStyle(templatedScreen.DefaultScreenOptions.DefaultStyle);
                screen.AddControl(txt, "Center", "Center");
            }
            return screen;
        }

        private static createScreenWithChronometer(id: number, templatedScreen: PanelLeaderModels.TemplatedScreenWithTimeControl, startMode: string, stopMode: string, chronometer: string, maxTime: number): Models.Screen {
            let screen: Models.Screen = Screen.createScreen(id, templatedScreen);

            if (startMode == "ClickOnStartButton") {
                let btn = ScreenReader.Controls.CustomButton.Create(Framework.LocalizationManager.Get("START", templatedScreen.DefaultScreenOptions.Language), "StartChronometer", Screen.buttonHeight, Screen.buttonWidth);
                btn.SetStyle(templatedScreen.DefaultScreenOptions.DefaultStyle);
                screen.AddControl(btn, "60", "100");
            }
            if (stopMode == "ClickOnStopButton") {
                let b = ScreenReader.Controls.CustomButton.Create(Framework.LocalizationManager.Get("STOP", templatedScreen.DefaultScreenOptions.Language), "StopChronometer", Screen.buttonHeight, Screen.buttonWidth);
                b.SetStyle(templatedScreen.DefaultScreenOptions.DefaultStyle);
                //TODO
                //if (templatedScreen.NextScreenMode == "ClickOnStopButton") {
                //    b._Action = "StopChronometerThenGoToNextPage";
                //    b._Content = Framework.LocalizationManager.Get("SessionTemplate_GoToNextPage", language)
                //}
                screen.AddControl(b, "60", "400");
            }
            //if (options.NextScreenMode == "ClickOnNextButton") {
            //    SubjectSessionReader.Controls.CustomButton.Create(Framework.LocalizationManager.Get("SessionTemplate_GoToNextPage", language), "GoToNextPage", Screen.buttonHeight, Screen.buttonWidth, style).AddToScreen(screen, "Bottom", "Right");
            //}
            if (chronometer != "NoChronometer") {
                let chrono = ScreenReader.Controls.CustomChronometer.Create(maxTime, 50, 50, templatedScreen.DefaultScreenOptions.DefaultStyle);
                if (chronometer == "NotVisible") {
                    chrono._IsVisible = false;
                } else {
                    chrono._IsVisible = true;
                }
                screen.AddControl(chrono, "60", "Right");
            }

            return screen;
        }

        //TODO : utiliser dans scenario -> cretaeScreenFromTemplate : écran simple, écran répété, écran avec titre et contenu, écran avec contrôle, écran minuté...

        public static CreateTDSScreen(id: number, templatedScreen: PanelLeaderModels.TemplatedScreenWithTDS): Models.Screen {
            let screen: Models.Screen = Screen.createScreenWithChronometer(id, templatedScreen, templatedScreen.StartMode, templatedScreen.StopMode, templatedScreen.Chronometer, templatedScreen.MaxTime);
            templatedScreen.TDSControl.SetStyle(templatedScreen.DefaultScreenOptions.DefaultStyle);
            screen.AddControl(templatedScreen.TDSControl, "160", "Center");
            return screen;
        }

        public static CreateCATAScreen(id: number, templatedScreen: PanelLeaderModels.TemplatedScreenWithCATA): Models.Screen {
            let screen: Models.Screen;
            if (templatedScreen.CATAControl._DataType == "TCATA") {
                screen = Screen.createScreenWithChronometer(id, templatedScreen, templatedScreen.StartMode, templatedScreen.StopMode, templatedScreen.Chronometer, templatedScreen.MaxTime);
            } else {
                screen = Screen.createScreen(id, templatedScreen);
            }
            templatedScreen.CATAControl.SetStyle(templatedScreen.DefaultScreenOptions.DefaultStyle);
            screen.AddControl(templatedScreen.CATAControl, "160", "Center");
            return screen;
        }

        public static CreateSortingScreen(id: number, templatedScreen: PanelLeaderModels.TemplatedScreenWithSorting): Models.Screen {
            let screen: Models.Screen = Screen.createScreen(id, templatedScreen);
            templatedScreen.SortingControl.SetStyle(templatedScreen.DefaultScreenOptions.DefaultStyle);
            screen.AddControl(templatedScreen.SortingControl, "160", "Center");
            return screen;
        }

        public static CreateRankingScreen(id: number, templatedScreen: PanelLeaderModels.TemplatedScreenWithRanking): Models.Screen {
            let screen: Models.Screen = Screen.createScreen(id, templatedScreen);
            templatedScreen.RankingControl.SetStyle(templatedScreen.DefaultScreenOptions.DefaultStyle);
            screen.AddControl(templatedScreen.RankingControl, "160", "Center");
            return screen;
        }

        public static CreateNappingScreen(id: number, templatedScreen: PanelLeaderModels.TemplatedScreenWithNapping): Models.Screen {
            let screen: Models.Screen = Screen.createScreen(id, templatedScreen);
            templatedScreen.NappingControl.SetStyle(templatedScreen.DefaultScreenOptions.DefaultStyle);
            screen.AddControl(templatedScreen.NappingControl, "160", "Center");
            return screen;
        }

        public static CreateDiscriminationScreen(id: number, templatedScreen: PanelLeaderModels.TemplatedScreenWithDiscrimination): Models.Screen {
            let screen: Models.Screen = Screen.createScreen(id, templatedScreen);
            templatedScreen.DiscriminationControl.SetStyle(templatedScreen.DefaultScreenOptions.DefaultStyle);
            screen.AddControl(templatedScreen.DiscriminationControl, "160", "Center");
            return screen;
        }

        //TODO : utiliser tous ces templates de création dans le scénario, pour ajouter un nouvel écran

        public static CreateDiscreteScaleScreen(id: number, templatedScreen: PanelLeaderModels.TemplatedScreenWithDiscreteScale): Models.Screen {
            let screen: Models.Screen = Screen.createScreenWithChronometer(id, templatedScreen, templatedScreen.StartMode, templatedScreen.StopMode, templatedScreen.Chronometer, templatedScreen.MaxTime);
            templatedScreen.DiscreteScale.SetStyle(templatedScreen.DefaultScreenOptions.DefaultStyle);

            //TODO : recréer avec le bon nombre de points en fonction du template

            screen.AddControl(templatedScreen.DiscreteScale, "160", "Center");
            return screen;
        }

        public static CreateContinuousScaleScreen(id: number, templatedScreen: PanelLeaderModels.TemplatedScreenWithContinuousScale): Models.Screen {
            let screen: Models.Screen = Screen.createScreenWithChronometer(id, templatedScreen, templatedScreen.StartMode, templatedScreen.StopMode, templatedScreen.Chronometer, templatedScreen.MaxTime);
            templatedScreen.ContinuousScale.SetStyle(templatedScreen.DefaultScreenOptions.DefaultStyle);
            screen.AddControl(templatedScreen.ContinuousScale, "160", "Center");
            return screen;
        }

        public static CreateTDSAndDiscreteScaleScreen(id: number, templatedScreen: PanelLeaderModels.TemplatedScreenWithTDSAndDiscreteScale): Models.Screen {
            templatedScreen.TDSControl._Height = 400;
            templatedScreen.DiscreteScale._Height = 150;
            let screen: Models.Screen = Screen.CreateTDSScreen(id, templatedScreen);
            screen.AddControl(templatedScreen.DiscreteScale, "560", "Center");
            return screen;
        }

        public static CreateTDSAndContinuousScaleScreen(id: number, templatedScreen: PanelLeaderModels.TemplatedScreenWithTDSAndContinuousScale): Models.Screen {
            templatedScreen.TDSControl._Height = 400;
            templatedScreen.ContinuousScale._Height = 150;
            let screen: Models.Screen = Screen.CreateTDSScreen(id, templatedScreen);
            templatedScreen.ContinuousScale.SetStyle(templatedScreen.DefaultScreenOptions.DefaultStyle);
            screen.AddControl(templatedScreen.ContinuousScale, "560", "Center");
            return screen;
        }

        public static CreateExitScreen(id: number, templatedScreen: PanelLeaderModels.TemplatedScreenWithExit): Models.Screen {
            let screen: Models.Screen = Screen.createScreen(id, templatedScreen);
            let button = ScreenReader.Controls.CustomButton.Create("", "", Screen.buttonHeight, Screen.buttonWidth);
            button.SetStyle(templatedScreen.DefaultScreenOptions.DefaultStyle);
            if (templatedScreen.EndAction == "GoToURL") {
                button._Action = "GoToURL";
                button._Content = Framework.LocalizationManager.Get("SessionTemplate_GoToURL", templatedScreen.DefaultScreenOptions.Language);
                button._URL = templatedScreen.URL;
            }
            if (templatedScreen.EndAction == "GoToLoginScreen") {
                button._Action = "GoToLoginScreen";
                button._Content = Framework.LocalizationManager.Get("SessionTemplate_GoToLoginScreen", templatedScreen.DefaultScreenOptions.Language);
            }
            screen.AddControl(button, "Bottom", "Right");
            return screen;
        }

        //public static CreateScreenWithSubjectSummary(id: number, templatedScreen: PanelLeaderModels.TemplatedScreenWithSubjectSummary): Models.Screen {
        //    let screen: Models.Screen = Screen.createScreen(id, templatedScreen);
        //    templatedScreen.SubjectSummary = ScreenReader.Controls.SubjectSummary.Create();
        //    screen.AddControl(templatedScreen.SubjectSummary, "Center", "Center");
        //    return screen;
        //}

        public static Create(experimentalDesignId: number, background: string = "white", resolution: string = "1:1"): Models.Screen {
            let screen = new Models.Screen();
            screen.Background = background;
            screen.Controls = [];
            screen.ExperimentalDesignId = experimentalDesignId;
            screen.IsConditionnal = false;
            screen.Resolution = resolution;
            return screen;
        }

        public static HasControlOfType(screen: Screen, controlType: string): boolean {
            return (screen.Controls.filter((x) => { return x._Type == controlType }).length > 0);
        }

        public static GetControlsOfType(screen: Screen, controlType: string): ScreenReader.Controls.BaseControl[] {
            return (screen.Controls.filter((x) => {
                return x._Type == controlType
            }));
        }

        public static IsTimed(screen: Screen): string {
            return (<any>Models.Screen.HasControlOfType(screen, "CustomTimer")).toString();
        }

        public static GetExperimentalDesignName(screen: Models.Screen, designs: Models.ExperimentalDesign[]): string {
            let experimentalDesignName = "-";
            if (screen.ExperimentalDesignId > 0) {
                experimentalDesignName = designs.filter((x) => { return x.Id == screen.ExperimentalDesignId })[0].Name;
            }
            return experimentalDesignName;
        }

        public static HasConditions(screen: Models.Screen): boolean {
            let conditionsLength = 0;
            if (screen.ListConditions) {
                if (screen.ListConditions.AttributeConditions) {
                    conditionsLength += screen.ListConditions.AttributeConditions.length;
                }
                if (screen.ListConditions.ProductConditions) {
                    conditionsLength += screen.ListConditions.ProductConditions.length;
                }
                if (screen.ListConditions.ReplicateConditions) {
                    conditionsLength += screen.ListConditions.ReplicateConditions.length;
                }
                if (screen.ListConditions.IntakeConditions) {
                    conditionsLength += screen.ListConditions.IntakeConditions.length;
                }
                if (screen.ListConditions.SubjectConditions) {
                    conditionsLength += screen.ListConditions.SubjectConditions.length;
                }
                if (screen.ListConditions.ProductRankConditions) {
                    conditionsLength += screen.ListConditions.ProductRankConditions.length;
                }
            }
            return (screen.IsConditionnal == true && conditionsLength > 0);
        }

        //public static SetControlsFromCanvas(canvas: Element): ScreenReader.Controls.BaseControl[] {
        //    var cpt: number = 0;
        //    var listControls: ScreenReader.Controls.BaseControl[] = [];

        //    while (cpt < canvas.childNodes.length) {
        //        var currentControl: ScreenReader.Controls.BaseControl = null;
        //        var htmlElement: HTMLElement;
        //        var control: any = canvas.childNodes[cpt]

        //        switch (control.nodeName) {
        //            case "my:TextArea":
        //                currentControl = new ScreenReader.Controls.TextArea(control);
        //                break;
        //            case "my:FreeListOfTerms":
        //                currentControl = new ScreenReader.Controls.FreeListOfTerms(control);
        //                break;
        //            case "my:CustomProgressBar":
        //                currentControl = new ScreenReader.Controls.CustomProgressBar(control);
        //                break;
        //            case "my:CATAControl":
        //                currentControl = new ScreenReader.Controls.CATAControl(control);
        //                break;
        //            case "my:DiscreteScalesControl":
        //                currentControl = new ScreenReader.Controls.DiscreteScalesControl(control);
        //                break;
        //            case "my:SlidersControl":
        //                currentControl = new ScreenReader.Controls.SlidersControl(control);
        //                break;
        //            case "my:TOSControl":
        //                //TODO
        //                break;
        //            case "my:QuestionControl":
        //                currentControl = new ScreenReader.Controls.QuestionControl(control);
        //                break;
        //            case "my:QuestionTableControl":
        //                currentControl = new ScreenReader.Controls.QuestionTableControl(control);
        //                break;
        //            case "my:CustomImage":
        //                currentControl = new ScreenReader.Controls.CustomImage(control);
        //                break;
        //            case "my:CustomMedia":
        //                currentControl = new ScreenReader.Controls.CustomMedia(control);
        //                break;
        //            case "my:SubjectForm":
        //                currentControl = new ScreenReader.Controls.SubjectForm(control);
        //                break;
        //            case "my:SubjectSummary":
        //                currentControl = new ScreenReader.Controls.SubjectSummary(control);
        //                break;
        //            case "my:SortingControl":
        //                currentControl = new ScreenReader.Controls.SortingControl(control);
        //                break;
        //            case "my:NappingControl":
        //                currentControl = new ScreenReader.Controls.NappingControl(control);
        //                break;
        //            case "my:RankingControl":
        //                currentControl = new ScreenReader.Controls.RankingControl(control);
        //                break;
        //            //case "my:DATIControl":
        //            //    currentControl = new SubjectSessionReader.Controls.DATIControl(control);
        //            //    break;
        //            case "my:TriangleTestControl":
        //                currentControl = new ScreenReader.Controls.TriangleTestControl(control);
        //                break;
        //            case "my:AnchorControl":
        //                currentControl = new ScreenReader.Controls.AnchorControl(control);
        //                break;
        //            case "my:CustomChronometer":
        //                currentControl = new ScreenReader.Controls.CustomChronometer(control);
        //                break;
        //            case "my:CustomTimer":
        //                currentControl = new ScreenReader.Controls.CustomTimer(control);
        //                break;
        //            case "my:CustomButton":
        //                currentControl = new ScreenReader.Controls.CustomButton(control);
        //                break;
        //            case "my:DTSButtonsControl":
        //                currentControl = new ScreenReader.Controls.DTSButtonsControl(control);
        //                break;
        //            case "my:MediaRecorderControl":
        //                currentControl = new ScreenReader.Controls.MediaRecorderControl(control);
        //                break;
        //            case "my:GroupDescriptionControl":
        //                currentControl = new ScreenReader.Controls.GroupDescriptionControl(control);
        //                break;
        //            case "Rectangle":
        //                currentControl = new ScreenReader.Controls.Rectangle(control);
        //                break;
        //        }

        //        if (currentControl != null) {
        //            listControls.push(currentControl);
        //        }
        //        cpt++;
        //    }

        //    return listControls;
        //}

        public static SetControls(screen: Screen): ScreenReader.Controls.BaseControl[] {

            //if (screen.Controls == undefined) {
            //    // Lecture depuis canvas
            //    return [];
            //}

            var cpt: number = 0;
            var listControls: ScreenReader.Controls.BaseControl[] = [];

            while (cpt < screen.Controls.length) {
                var currentControl: ScreenReader.Controls.BaseControl = null;

                var htmlElement: HTMLElement;
                var control: ScreenReader.Controls.BaseControl = screen.Controls[cpt];

                switch (control._Type) {
                    case "TextArea":
                        currentControl = new ScreenReader.Controls.TextArea();
                        //alert(controls["CheckCompatibility"]);
                        break;
                    case "SpeechToText":
                        currentControl = new ScreenReader.Controls.SpeechToText();
                        break;
                    case "FreeListOfTerms":
                        currentControl = new ScreenReader.Controls.FreeListOfTerms();
                        break;
                    case "CustomProgressBar":
                        currentControl = new ScreenReader.Controls.CustomProgressBar();
                        break;
                    case "CATAControl":
                        currentControl = new ScreenReader.Controls.CATAControl();
                        break;
                    case "DiscreteScalesControl":
                        currentControl = new ScreenReader.Controls.DiscreteScalesControl();
                        break;
                    case "SlidersControl":
                        currentControl = new ScreenReader.Controls.SlidersControl();
                        break;
                    case "TOSControl":
                        //TODO
                        break;
                    //case "QuestionControl":
                    //    currentControl = new ScreenReader.Controls.QuestionControl();
                    //    break;
                    case "FreeTextQuestionControl":
                        currentControl = new ScreenReader.Controls.FreeTextQuestionControl();
                        break;
                    case "CheckboxQuestionControl":
                        currentControl = new ScreenReader.Controls.CheckboxQuestionControl();
                        break;
                    case "ComboboxQuestionControl":
                        currentControl = new ScreenReader.Controls.ComboboxQuestionControl();
                        break;
                    case "SampleCodeChecker":
                        currentControl = new ScreenReader.Controls.SampleCodeChecker();
                        break;
                    case "SampleCodeInput":
                        currentControl = new ScreenReader.Controls.SampleCodeInput();
                        break;
                    //case "QuestionTableControl":
                    //    currentControl = new ScreenReader.Controls.QuestionTableControl();
                    //    break;
                    case "CustomImage":
                        currentControl = new ScreenReader.Controls.CustomImage();
                        break;
                    case "CustomMedia":
                        currentControl = new ScreenReader.Controls.CustomMedia();
                        break;
                    //case "SubjectForm":
                    //    currentControl = new ScreenReader.Controls.SubjectForm();
                    //    break;
                    //case "SubjectSummary":
                    //    currentControl = new ScreenReader.Controls.SubjectSummary();
                    //    break;
                    case "SortingControl":
                        currentControl = new ScreenReader.Controls.SortingControl();
                        break;
                    case "NappingControl":
                        currentControl = new ScreenReader.Controls.NappingControl();
                        break;
                    case "RankingControl":
                        currentControl = new ScreenReader.Controls.RankingControl();
                        break;
                    //case "DATIControl":
                    //    currentControl = new SubjectSessionReader.Controls.DATIControl();
                    //break;
                    case "TriangleTestControl":
                        currentControl = new ScreenReader.Controls.TriangleTestControl();
                        break;
                    case "AnchorControl":
                        currentControl = new ScreenReader.Controls.AnchorControl();
                        break;
                    case "CustomChronometer":
                        currentControl = new ScreenReader.Controls.CustomChronometer();
                        break;
                    case "CustomTimer":
                        currentControl = new ScreenReader.Controls.CustomTimer();
                        break;
                    case "CustomButton":
                        currentControl = new ScreenReader.Controls.CustomButton();
                        break;
                    case "DiscriminationTest":
                        currentControl = new ScreenReader.Controls.DiscriminationTestControl();
                        break;
                    case "DTSButtonsControl":
                        currentControl = new ScreenReader.Controls.DTSButtonsControl();
                        break;
                    case "VideoRecorder":
                        currentControl = new ScreenReader.Controls.VideoRecorder();
                        break;
                    case "PhotoRecorder":
                        currentControl = new ScreenReader.Controls.PhotoRecorder();
                        break;
                    case "ExternalDocument":
                        currentControl = new ScreenReader.Controls.ExternalDocument();
                        break;
                    case "RandomPrice":
                        currentControl = new ScreenReader.Controls.RandomPrice();
                        break;
                    case "GroupDescriptionControl":
                        currentControl = new ScreenReader.Controls.GroupDescriptionControl();
                        break;
                    case "Rectangle":
                        currentControl = new ScreenReader.Controls.Rectangle();
                        break;
                    case "InteractiveWheel":
                        currentControl = new ScreenReader.Controls.InteractiveWheel();
                        break;
                    //case "TDSTutorial":
                    //    currentControl = new ScreenReader.Controls.TDSTutorial();
                    //    break;
                    //case "BarcodeReader":
                    //    currentControl = new ScreenReader.Controls.BarcodeReader();
                    //    break;
                    default:
                        currentControl = null;
                        break;
                }

                if (currentControl != null) {

                    // Copie des propriétés
                    for (var k in control) {
                        currentControl[k] = control[k];
                    }

                    listControls.push(currentControl);
                }
                cpt++;
            }

            return listControls;
        }

        //public static SetControls(screen: Screen): ScreenReader.Controls.BaseControl[] {
        //    let controls: ScreenReader.Controls.BaseControl[] = [];
        //    //if (screen.Controls == undefined) {
        //    //    var canvas: Element = Screen.readXMLOfScreen(screen);
        //    //    controls = Models.Screen.SetControlsFromCanvas(canvas);
        //    //} else {
        //        controls = Models.Screen.SetControlsFromScreen(screen);
        //    //}
        //    return controls;
        //}

        //private static readXMLOfScreen(screen: Screen): Element {
        //    var xml: string = screen.XamlContent;
        //    var canvas: Element = Models.Screen.ReadXAML(xml);
        //    return canvas;
        //}

        public static GetRatio(screen: Screen): number {

            let ratio: number = 1;

            if (screen.Resolution == "1:1") {
                ratio = 1;
            }
            if (screen.Resolution == "4:3") {
                ratio = 4 / 3;
            }
            if (screen.Resolution == "16:9") {
                ratio = 16 / 9;
            }
            if (screen.Resolution == "16:10") {
                ratio = 16 / 10;
            }

            return ratio;
        }

        public static RemoveControl(screen: Screen, control: ScreenReader.Controls.BaseControl): void {
            Framework.Array.Remove(screen.Controls, control);
        }

        public static RenderContainer(screen: Screen, parentHeight: number, parentWidth: number): HTMLDivElement {

            let container = document.createElement("div");

            if (screen.Background == undefined) {
                screen.Background = "white";
            }

            container.style.background = screen.Background;

            //let screenHeight: number = 800;

            //if (screen.Controls == undefined) {
            //    // Fichier créé en Silverlight : lecture de XAMLContent
            //    // Elément canvas de l'écran (contient les différents contrôles)
            //    var canvas: Element = Screen.ReadXAML(screen.XamlContent);

            //    if (canvas != null) {
            //        // Taille de l'écran
            //        screenHeight = Number(canvas.getAttribute("Height").valueOf());
            //    }
            //}

            //let screenWidth: number = Screen.GetRatio(screen) * screenHeight;
            let screenWidth: number = Screen.Width(screen);

            container.style.height = parentHeight + "px";
            //container.style.width = parentWidth + "px";
            container.style.width = (parentHeight * Screen.GetRatio(screen)) + "px";


            let widthRatio = parentWidth / screenWidth;
            //let heightRatio = parentHeight / screenHeight;
            let heightRatio = parentHeight / Screen.Height;
            let ratio = Math.min(widthRatio, heightRatio);
            screen.Ratio = ratio;


            // Rendu de l'écran
            //container.style.height = screenHeight + "px";
            //container.style.width = screenWidth + "px";  //-2 à cause de la bordure
            //Framework.Scale.ScaleDiv(container, parentWidth, parentHeight);
            screen.container = container;

            return container;
        }

        public static Render(screen: Screen, height: number, width: number, listExperimentalDesigns: Models.ExperimentalDesign[], onControlSelect: (control: ScreenReader.Controls.BaseControl) => void): HTMLDivElement {


            //let screenHeight: number = 800;
            //let screenWidth: number = Screen.GetRatio(this) * screenHeight;


            //let widthRatio = width / screenWidth;
            //let heightRatio = height / screenHeight;

            let widthRatio = width / Screen.Width(screen);
            let heightRatio = height / Screen.Height;

            let ratio = Math.min(widthRatio, heightRatio);
            screen.Ratio = ratio;

            let div = Models.Screen.RenderContainer(screen, height, width);

            screen.Controls = Models.Screen.SetControls(screen);

            for (var i = 0; i < screen.Controls.length; i++) {
                let control = screen.Controls[i];

                //if (control instanceof ScreenReader.Controls.SubjectForm) {
                //    (<ScreenReader.Controls.SubjectForm>control).Subject = self.subject;
                //}
                if (control instanceof ScreenReader.Controls.DataControl) {
                    let dataControl: ScreenReader.Controls.DataControl = <ScreenReader.Controls.DataControl>control;
                    let design: Models.ExperimentalDesign = listExperimentalDesigns.filter((x) => { return x.Id == dataControl._ExperimentalDesignId })[0];
                    if (design && design.ListExperimentalDesignRows.length > 0) {
                        dataControl.SubjectCode = design.ListExperimentalDesignRows[0].SubjectCode;
                        if ((<any>design.ListExperimentalDesignRows[0]).ProductCode) {
                            dataControl.ProductCode = (<Models.ProductExperimentalDesignRow>design.ListExperimentalDesignRows[0]).ProductCode;
                            if (screen.ExperimentalDesignId > 0) {
                                let rows = <Models.AttributeExperimentalDesignRow[]>listExperimentalDesigns.filter((x) => {
                                    return x.Id == screen.ExperimentalDesignId
                                })[0].ListExperimentalDesignRows;
                                if (rows.length > 0) {
                                    dataControl.AttributeCode = rows[0].AttributeCode;
                                }
                            }
                        }
                        if ((<any>design.ListExperimentalDesignRows[0]).AttributeCode) {
                            dataControl.AttributeCode = (<Models.AttributeExperimentalDesignRow>design.ListExperimentalDesignRows[0]).AttributeCode;
                            if (screen.ExperimentalDesignId > 0) {
                                dataControl.ProductCode = (<Models.ProductExperimentalDesignRow>((listExperimentalDesigns.filter((x) => { return x.Id == screen.ExperimentalDesignId })[0]).ListExperimentalDesignRows[0])).ProductCode;
                            }
                        }
                    }
                    dataControl.Replicate = 1;
                    dataControl.ProductRank = 1;
                    dataControl.AttributeRank = 1;
                    dataControl.UploadId = 1;
                    dataControl.SetExperimentalDesign(design);
                    if (control instanceof ScreenReader.Controls.GroupedControl) {
                        //(<ScreenReader.Controls.GroupedControl>control).SetAttributeExperimentalDesign(listExperimentalDesigns.filter((x) => { return x.Id == (<ScreenReader.Controls.GroupedControl>control)._AttributeExperimentalDesignId })[0]);
                        (<ScreenReader.Controls.GroupedControl>control).SetAttributeExperimentalDesign(listExperimentalDesigns.filter((x) => { return x.Id == (<ScreenReader.Controls.GroupedControl>control)._ExperimentalDesignId })[0]);
                    }
                }
                if (control != null) {
                    if (control.Render) {
                        if (onControlSelect) {
                            control.RenderWithAdorner(div, screen, ratio, undefined);
                            control.OnSelect = onControlSelect;
                        }
                        else {
                            // Controle non sélectionnable
                            control.SetScreen(screen);
                            //control.Render(true, ratio);
                            control.Render(false, ratio);
                            div.appendChild(control.HtmlElement);
                        }
                    } else {

                        Framework.Array.Remove(screen.Controls, control);
                    }
                }
            }

            div.style.transformOrigin = "left top";
            div.id = "currentScreen";

            screen.container = div;

            return div;
        }

        public SetBackground(color: string) {
            this.Background = color;
            this.container.style.background = color;
        }

        public AddControl(control: ScreenReader.Controls.BaseControl, topPosition: string = "Center", leftPosition: string = "Center") {

            //let top = Number(topPosition);
            //if (top) {
            //    control._Top = top;
            //} else {
            //    if (topPosition == "Top") {
            //        control._Top = 10;
            //    }
            //    if (topPosition == "Center") {
            //        control._Top = (this.Height - control._Height) / 2;
            //    }
            //    if (topPosition == "Bottom") {
            //        control._Top = this.Height - 10 - control._Height;
            //    }
            //}

            //let left = Number(leftPosition);
            //if (left) {
            //    control._Left = left;
            //} else {
            //    if (leftPosition == "Left") {
            //        control._Left = 10;
            //    }
            //    if (leftPosition == "Center") {
            //        control._Left = (this.Width - control._Width) / 2;
            //    }
            //    if (leftPosition == "Right") {
            //        control._Left = this.Width - 10 - control._Width;
            //    }
            //}

            //this.Controls.push(control);

            Screen.AddControlStatic(this, control, topPosition, leftPosition);

            if (this.Container) {
                control.RenderWithAdorner(this.Container, this, this.Ratio);
            }

            //this.container.appendChild(control.HtmlElement);
            //TODO : trigger OnAddControl

            // private addControl(control: ScreenReader.Controls.BaseControl): void {
            //this.ClearControlsSelection();
            //this.Screen.Controls.push(control);
            //this.RenderControlWithAdorner(control/*, this.listFriendlyNames*/);
            //control.ListFriendlyNames = this.listFriendlyNames;
            //control.SetFriendlyName();
            //control.Highlight();

            //this.SelectedControl = control;
            ////if (control.HasEditableProperties()) {
            ////    control.EditControlProperties();
            ////}
            ////this.onSelectedControlChanged();

        }

        public static AddControlStatic(screen: Screen, control: ScreenReader.Controls.BaseControl, topPosition: string = "Center", leftPosition: string = "Center") {
            let top = Number(topPosition);
            if (top) {
                control._Top = top;
            } else {
                if (topPosition == "Top") {
                    control._Top = 10;
                }
                if (topPosition == "Center") {
                    control._Top = (Screen.Height - control._Height) / 2;
                }
                if (topPosition == "Bottom") {
                    control._Top = Screen.Height - 10 - control._Height;
                }
            }

            let left = Number(leftPosition);
            if (left) {
                control._Left = left;
            } else {
                if (leftPosition == "Left") {
                    control._Left = 10;
                }
                if (leftPosition == "Center") {
                    control._Left = (Screen.Width(screen) - control._Width) / 2;
                }
                if (leftPosition == "Right") {
                    control._Left = Screen.Width(screen) - 10 - control._Width;
                }
            }

            screen.Controls.push(control);

        }

        public GetChronometer(): ScreenReader.Controls.CustomChronometer {
            let timers = this.Controls.filter((x) => { return x._Type == "CustomChronometer"; });
            if (timers.length > 0) {
                return <ScreenReader.Controls.CustomChronometer>timers[0];
            }
            return undefined;
        }

        public GetTimer(): ScreenReader.Controls.CustomTimer {
            let timers = this.Controls.filter((x) => { return x._Type == "CustomTimer"; });
            if (timers.length > 0) {
                return <ScreenReader.Controls.CustomTimer>timers[0];
            }
            return undefined;
        }

        public SetTimer(time: number) {
            let timer = this.GetTimer();
            if (timer) {
                timer._MaxTime = time;
                timer.SetText(time);
            }
        }

        public GetSpeechToText(): ScreenReader.Controls.SpeechToText {
            let timers = this.Controls.filter((x) => { return x._Type == "SpeechToText"; });
            if (timers.length > 0) {
                return <ScreenReader.Controls.SpeechToText>timers[0];
            }
            return undefined;
        }

        public AlignControlsOnGrid() {
            //TODO
            alert("todo");
        }

        public RenderAsMiniature(index: number, miniatureWidth: number, listExperimentalDesigns: Models.ExperimentalDesign[], onClick: (miniature: Models.ScreenMiniature) => void): ScreenMiniature {
            let self = this;

            let screen = Framework.Factory.CreateFrom(Models.Screen, this);

            let wrapperDiv: HTMLDivElement = document.createElement("div");

            let width = miniatureWidth;
            let height = miniatureWidth / Models.Screen.GetRatio(screen);

            let miniatureDiv: HTMLDivElement = Models.Screen.Render(screen, height, width, listExperimentalDesigns, undefined);

            miniatureDiv.style.margin = "0";
            miniatureDiv.style.border = "1px solid black";
            miniatureDiv.id = "screen" + screen.Id;

            miniatureDiv.style.position = "absolute";

            wrapperDiv.appendChild(miniatureDiv);

            wrapperDiv.style.height = (height + 2) + "px";
            wrapperDiv.style.width = (width + 2) + "px";
            wrapperDiv.style.marginBottom = "5px";
            wrapperDiv.style.position = "relative";
            wrapperDiv.style.cursor = "pointer";
            wrapperDiv.onclick = () => { onClick(screenMini) };

            // Numéro de l'écran
            let numberdiv: HTMLDivElement = document.createElement("div");
            numberdiv.innerText = (index + 1).toString();
            numberdiv.style.opacity = "0.5";
            numberdiv.style.height = wrapperDiv.style.height;
            numberdiv.style.width = wrapperDiv.style.width;
            numberdiv.style.textAlign = "center";
            numberdiv.style.lineHeight = wrapperDiv.style.height;
            numberdiv.style.fontSize = "40px";
            numberdiv.style.textShadow = "1px 1px black";
            numberdiv.style.position = "absolute";
            numberdiv.style.cursor = "pointer";
            numberdiv.classList.add("numberDiv");

            wrapperDiv.appendChild(numberdiv);

            let screenInfoDiv = document.createElement("div");
            screenInfoDiv.classList.add("screenInfo");
            wrapperDiv.appendChild(screenInfoDiv);

            screenInfoDiv.innerHTML = "";

            let screenTypeDiv: HTMLButtonElement = document.createElement("button");
            screenInfoDiv.appendChild(screenTypeDiv);

            if (Models.Screen.HasConditions(screen)) {
                // Ecran conditionnel
                let conditionaldiv: HTMLButtonElement = document.createElement("button");
                conditionaldiv.title = Framework.LocalizationManager.Get("ConditionalScreen");
                conditionaldiv.classList.add("conditionalScreen");
                conditionaldiv.classList.add("screenButton");
                screenInfoDiv.appendChild(conditionaldiv);
            }

            if (Models.Screen.HasControlOfType(screen, "CustomTimer")) {
                // Ecran minuté
                let timeddiv: HTMLButtonElement = document.createElement("button");
                timeddiv.title = Framework.LocalizationManager.Get("TimedScreen");
                timeddiv.classList.add("timedScreen");
                timeddiv.classList.add("screenButton");
                screenInfoDiv.appendChild(timeddiv);
            }

            if (screen.ExperimentalDesignId > 0) {
                let experimentalDesignName = "";
                let experimentalDesignNames = listExperimentalDesigns.filter((x) => { return x.Id == screen.ExperimentalDesignId; });
                if (listExperimentalDesigns.length > 0) {
                    experimentalDesignName = listExperimentalDesigns[0].Name;
                }

                // Ecran répété                
                screenTypeDiv.title = Framework.LocalizationManager.Format("RepeatedScreen", [experimentalDesignName]);
                screenTypeDiv.classList.add("repeatedScreen");
                screenTypeDiv.classList.add("screenButton");
            } else {
                screenTypeDiv.title = Framework.LocalizationManager.Get("SingleScreen");
                screenTypeDiv.classList.add("singleScreen");
                screenTypeDiv.classList.add("screenButton");
            }

            let screenMini: ScreenMiniature = new ScreenMiniature();
            screenMini.Screen = this;
            screenMini.Div = wrapperDiv;
            screenMini.NumberDiv = numberdiv;

            return screenMini;
        }
    }

    export class ScreenMiniature {
        public Screen: Models.Screen;
        public Div: HTMLDivElement;
        public NumberDiv: HTMLDivElement;

        public AddDiv(div: HTMLDivElement) {
            this.Div.appendChild(div);
        }

    }

    export class Condition {
        public ProductRankConditions: number[] = [];
        public ReplicateConditions: number[] = [];
        public IntakeConditions: number[] = [];
        public ProductConditions: string[] = [];
        public AttributeConditions: string[] = [];
        public SubjectConditions: string[] = [];
    }

    export class ScreenWithExperimentalDesign extends Screen {
        public Screen: Screen;
        public Replicate: number;
        public Intake: number;
        public SubjectCode: string;
        public ProductCode: string;
        public AttributeCode: string;
        public ProductRank: number;
        public AttributeRank: number;
        //public AlreadyDisplayed: boolean = false;

        public VerifyConditions(): boolean {
            try {
                // Replicate conditions
                var verifiedReplicateCondition: boolean = true;
                if (this.Screen.ListConditions.ReplicateConditions.length > 0) {
                    verifiedReplicateCondition = false;
                    var cpt: number = 0;
                    while (cpt < this.Screen.ListConditions.ReplicateConditions.length) {
                        if (this.Screen.ListConditions.ReplicateConditions[cpt] == this.Replicate) {
                            verifiedReplicateCondition = true;
                        }
                        cpt++;
                    }
                }

                // Intake conditions
                var verifiedIntakeCondition: boolean = true;
                if (this.Screen.ListConditions.IntakeConditions.length > 0) {
                    verifiedIntakeCondition = false;
                    var cpt: number = 0;
                    while (cpt < this.Screen.ListConditions.IntakeConditions.length) {
                        if (this.Screen.ListConditions.IntakeConditions[cpt] == this.Intake) {
                            verifiedIntakeCondition = true;
                        }
                        cpt++;
                    }
                }

                // Product conditions
                var verifiedProductCondition: boolean = true;
                if (this.Screen.ListConditions.ProductConditions.length > 0) {
                    verifiedProductCondition = false;
                    var cpt: number = 0;
                    while (cpt < this.Screen.ListConditions.ProductConditions.length) {
                        if (this.Screen.ListConditions.ProductConditions[cpt] == this.ProductCode) {
                            verifiedProductCondition = true;
                        }
                        cpt++;
                    }
                }

                // Subject conditions
                var verifiedSubjectCondition: boolean = true;
                if (this.Screen.ListConditions.SubjectConditions.length > 0) {
                    verifiedSubjectCondition = false;
                    var cpt: number = 0;
                    while (cpt < this.Screen.ListConditions.SubjectConditions.length) {
                        if (this.Screen.ListConditions.SubjectConditions[cpt] == this.SubjectCode || (this.Screen.ListConditions.SubjectConditions[cpt] == "ANONYMOUS" && this.SubjectCode.substring(0, 8) == "ANONYMOUS")) {
                            verifiedSubjectCondition = true;
                        }
                        cpt++;
                    }
                }

                // Product rank conditions
                var verifiedProductRankCondition: boolean = true;
                if (this.Screen.ListConditions.ProductRankConditions.length > 0) {
                    verifiedProductRankCondition = false;
                    var cpt: number = 0;
                    while (cpt < this.Screen.ListConditions.ProductRankConditions.length) {
                        if (this.Screen.ListConditions.ProductRankConditions[cpt] == this.ProductRank) {
                            verifiedProductRankCondition = true;
                        }
                        cpt++;
                    }
                }

                // Attribute conditions
                var verifiedAttributeCondition: boolean = true;
                if (this.Screen.ListConditions.AttributeConditions.length > 0) {
                    verifiedAttributeCondition = false;
                    var cpt: number = 0;
                    while (cpt < this.Screen.ListConditions.AttributeConditions.length) {
                        if (this.Screen.ListConditions.AttributeConditions[cpt] == this.AttributeCode) {
                            verifiedAttributeCondition = true;
                        }
                        cpt++;
                    }
                }

                return (verifiedReplicateCondition && verifiedIntakeCondition && verifiedProductCondition && verifiedSubjectCondition && verifiedProductRankCondition && verifiedAttributeCondition /*&& verifiedBlockCondition*/);
            }
            catch (ex) {
                return true;
            }
        }
    }

    export class ExperimentalDesignItem extends Framework.Database.DBItem {
        public Code: string;
        public Labels: Framework.KeyValuePair[];
        public DefaultRank: number;
        public LongName: string;
        public Color: string;
        /*public Image: string = "";*/
        public ImageURL: string = "";
        public Description: string = "";
        public Notes: string = "";

        public static Create(code: string, labels: Framework.KeyValuePair[] = undefined, longName: string = undefined, color: string = 'gray'): ExperimentalDesignItem {
            let edi = new ExperimentalDesignItem();
            edi.Code = code;
            edi.LongName = longName;
            if (edi.LongName == undefined) {
                edi.LongName = code;
            }
            edi.Labels = labels;
            if (edi.Labels == undefined) {
                edi.Labels = [{ Key: code, Value: code }];
            }
            edi.Color = color;
            return edi;
        }

        public static GetLabel(item: ExperimentalDesignItem, replicate: number): string {
            let res = "";
            item.Labels.forEach((kvp) => {
                if (kvp.Key == replicate) {
                    res = kvp.Value;
                }
            });
            return res;
        }

        public GetLabels(): string[] {
            let res = [];
            this.Labels.forEach((kvp) => {
                res.push(kvp.Value);
            });
            return res;
        }

        public GetReplicates(): number[] {
            let res = [];
            this.Labels.forEach((kvp) => {
                res.push(kvp.Key);
            });
            return res;
        }

        public static GetDataTableParameters(listItems: Models.ExperimentalDesignItem[], additionalFields: PanelLeaderModels.DBField[], onChange: (data: any, propertyName: string, oldValue: any, newValue: any) => void, designType: string = undefined, designPresentationMode: string = undefined): Framework.Form.DataTableParameters {

            let codes: string[] = [];
            let reps: number[] = [];

            listItems.forEach((item) => {
                if (designType == "Product") {
                    item.Labels.forEach((kvp) => {
                        item["R" + kvp.Key] = kvp.Value;
                        reps.push(kvp.Key);
                    });
                }
                codes.push(item.Code);
            });


            reps = Framework.Array.Unique(reps);
            let columnsRep: string[] = [];

            let parameters = new Framework.Form.DataTableParameters();
            parameters.Paging = false;

            parameters.ListData = listItems;
            parameters.ListColumns = [
                { data: "Code", title: Framework.LocalizationManager.Get("Code") },
                { data: "LongName", title: Framework.LocalizationManager.Get("LongName") },
                { data: "Notes", title: Framework.LocalizationManager.Get("Notes") }
            ];
            if (designType == "Product") {
                reps.forEach((x) => {
                    parameters.ListColumns.push({ data: "R" + x, title: "R" + x });
                    columnsRep.push("R" + x);
                });
            }

            PanelLeaderModels.DBField.ExtendDataTableColumnsWithDBFields(additionalFields, parameters.ListColumns);

            parameters.ListColumns.push({
                data: "Color", title: Framework.LocalizationManager.Get("Color"), render: function (data, type, row) {
                    if (data && type === 'display') {
                        return "<span style='color:" + data + "'>" + Framework.Color.HexToColorName(data) + "</span>";
                    }
                    return "";
                }
            });

            parameters.Order = [[0, 'desc']];
            parameters.OnEditCell = (propertyName, d) => {

                if (propertyName == "Code") {
                    return Framework.Form.InputText.Create(d["Code"], (x, y) => {
                        if (y.IsValid == true) {
                            d["Code"] = Framework.Form.Validator.RemoveSpecialCharacters(x);
                        }

                    }, Framework.Form.Validator.Unique(listItems.map(a => a.Code)), false, ["tableInput"]).HtmlElement;
                }

                if (propertyName == "LongName") {
                    return Framework.Form.InputText.Create(d["LongName"], (x, y) => {
                        d["LongName"] = x;
                    }, Framework.Form.Validator.NoValidation(), false, ["tableInput"]).HtmlElement;
                }

                if (columnsRep.indexOf(propertyName) > -1) {

                    let rep = Number(propertyName.replace("R", ""));
                    let input = Framework.Form.InputText.Create(d[propertyName], (x, y) => {
                        if (y.IsValid == true) {
                            d[propertyName] = Framework.Form.Validator.RemoveSpecialCharacters(x);
                        }
                    }, Framework.Form.Validator.Unique(listItems.map(a => a.Labels.map((y) => { return y.Value }))), false, ["tableInput"]);

                    if (designPresentationMode == "Triangle") {
                        let div = Framework.Form.TextElement.Create("");

                        let oldCodes = d[propertyName].split('|');

                        let input1 = Framework.Form.InputText.Create(oldCodes[0], (code, y) => {
                            if (y.IsValid == true) {
                                d[propertyName] = Framework.Form.Validator.RemoveSpecialCharacters(code) + "|" + oldCodes[1];
                                oldCodes = d[propertyName].split('|');
                            }

                        }, Framework.Form.Validator.Unique(listItems.map(a => a.Labels.map((y) => { return y.Value }))), false, ["tableInput2"]);
                        div.Append(input1);

                        let input2 = Framework.Form.InputText.Create(oldCodes[1], (code, y) => {
                            if (y.IsValid == true) {
                                d[propertyName] = oldCodes[0] + "|" + Framework.Form.Validator.RemoveSpecialCharacters(code);
                                oldCodes = d[propertyName].split('|');
                            }

                        }, Framework.Form.Validator.Unique(listItems.map(a => a.Labels.map((y) => { return y.Value }))), false, ["tableInput2"]);
                        div.Append(input2);

                        return div.HtmlElement;
                    } else if (designPresentationMode == "TwoOutOfFive") {
                        let div = Framework.Form.TextElement.Create("");

                        let oldCodes = d[propertyName].split('|');

                        let input1 = Framework.Form.InputText.Create(oldCodes[0], (code, y) => {
                            if (y.IsValid == true) {
                                d[propertyName] = Framework.Form.Validator.RemoveSpecialCharacters(code) + "|" + oldCodes[1] + "|" + oldCodes[2];
                                oldCodes = d[propertyName].split('|');
                            }

                        }, Framework.Form.Validator.Unique(listItems.map(a => a.Labels.map((y) => { return y.Value }))), false, ["tableInput3"]);
                        div.Append(input1);

                        let input2 = Framework.Form.InputText.Create(oldCodes[1], (code, y) => {
                            if (y.IsValid == true) {
                                d[propertyName] = oldCodes[0] + "|" + Framework.Form.Validator.RemoveSpecialCharacters(code) + "|" + oldCodes[2];
                                oldCodes = d[propertyName].split('|');
                            }

                        }, Framework.Form.Validator.Unique(listItems.map(a => a.Labels.map((y) => { return y.Value }))), false, ["tableInput3"]);
                        div.Append(input2);

                        let input3 = Framework.Form.InputText.Create(oldCodes[2], (code, y) => {
                            if (y.IsValid == true) {
                                d[propertyName] = oldCodes[0] + "|" + oldCodes[1] + "|" + Framework.Form.Validator.RemoveSpecialCharacters(code);
                                oldCodes = d[propertyName].split('|');
                            }

                        }, Framework.Form.Validator.Unique(listItems.map(a => a.Labels.map((y) => { return y.Value }))), false, ["tableInput3"]);
                        div.Append(input3);

                        return div.HtmlElement;
                    }
                    else {
                        return input.HtmlElement;
                    }
                }

                if (propertyName == "Color") {
                    let b = Framework.Form.PopupColorpickerButton.Render(() => { return true; }, (color) => {
                        d["Color"] = Framework.Color.HexToColorName(color);
                        b.style.color = d["Color"];
                        b.innerHTML = d["Color"];
                    }, [], '', d['Color']).HtmlElement;
                    b.innerHTML = d["Color"];
                    b.style.border = "0";
                    b.style.background = "transparent";
                    b.style.color = d["Color"];
                    b.style.textAlign = "left";
                    b.style.margin = "0";
                    b.style.padding = "0";
                    return b;
                }

                let fields = additionalFields.map((x) => { return "Custom" + x.ID });
                if (fields.indexOf(propertyName) > -1) {
                    let field = additionalFields.filter((x) => { return "Custom" + x.ID == propertyName })[0];
                    return PanelLeaderModels.DBField.OnEditDataTableCellWithDBFields(field, d, propertyName);
                }

            }
            parameters.OnDataChanged = (data, propertyName, oldValue, newValue) => {
                onChange(data, propertyName, oldValue, newValue);
            };

            return parameters;

        }

        public static GetImportTemplate(name: string): Framework.ImportManager.Template {

            let template: Framework.ImportManager.Template = new Framework.ImportManager.Template();
            template.Name = name;
            template.ColumnTemplates = [
                { AttributeName: "Code", Synonyms: ["code"], IsImperative: true, Description: Framework.LocalizationManager.Get("Product"), Type: String, ColumnName: "" },
                { AttributeName: "Description", Synonyms: ["description", "longname", "long name"], IsImperative: false, Description: Framework.LocalizationManager.Get("Description"), Type: String, ColumnName: "" },
                { AttributeName: "Notes", Synonyms: ["notes"], IsImperative: false, Description: Framework.LocalizationManager.Get("Notes"), Type: String, ColumnName: "" },
                //{ AttributeName: "Color", Synonyms: ["color", "couleur"], IsImperative: false, Description: Framework.LocalizationManager.Get("Color"), Type: String, ColumnName: "" }
            ];

            return template;
        }
    }

    export class ExperimentalDesign {

        //public bool HasChanges { get; set; }        
        //public int Seed { get; set; }
        //private bool isWithoutReplacement;
        public KeepRanksBetweenReplicates: boolean = false; //TODO
        public NoConsecutiveItems: boolean = false;//TODO
        public ShuffleReplicates: boolean = false;//TODO

        public static ConvertItemLabelsFromV1(design: ExperimentalDesign, list: any[] = undefined) {

            if (design.ListItems != undefined && design.ListItems.length > 0) {
                return;
            }

            if (design["ListItemLabels"] == undefined) {
                return;
            }

            design.ListItems = [];

            Framework.Array.Unique(design["ListItemLabels"].map((x) => { return x.Code })).forEach((code: string) => {
                let expDesignItem: Models.ExperimentalDesignItem = new Models.ExperimentalDesignItem();
                let index = 1;

                let newCode = code;
                while (design.ListItems.filter((x) => { return x.Code == code; }).length > 0) {
                    newCode = code + index;
                    index++;
                }
                expDesignItem.Code = newCode;

                expDesignItem.Labels = [];
                let labels = design["ListItemLabels"].filter((x) => { return x.Code == code });
                labels.forEach((x) => {
                    let kvp = new Framework.KeyValuePair(x.Replicate, x.Label);
                    expDesignItem.Labels.push(kvp);
                });

                if (list) {
                    let item = list.filter((x) => { return x.Code == code });
                    if (item.length > 0) {
                        if (item[0].Color) {
                            expDesignItem.Color = item[0].Color;
                        }
                        if (item[0].Description) {
                            expDesignItem.LongName = item[0].Description;
                        }
                    }
                }

                design.ListItems.push(expDesignItem);
            });
        }

        public static GetImportTemplate(name: string): Framework.ImportManager.Template {

            let template: Framework.ImportManager.Template = new Framework.ImportManager.Template();
            template.Name = name;
            template.NbFixedColumns = 1;

            template.ColumnTemplates = [
                { AttributeName: "SubjectCode", Synonyms: ["subjectcode", "code"], IsImperative: true, Description: "SubjectCode", Type: String, ColumnName: "" },
                { AttributeName: "Rank", Synonyms: ["rank", "rang"], IsImperative: true, Description: "Code", Type: "Automatic", ColumnName: "" }
            ];

            // TODO : masque de template

            //for (let i = 2; i < 50; i++) {
            //    template.ColumnTemplates.push({ AttributeName: "Rank " + i, Synonyms: ["rank " + i, "rang " + i], IsImperative: false, Description: "Code at rank " + i, Type: String, ColumnName: "" });
            //}

            return template;
        }

        public static GetDataTableParameters(height: number, listExperimentalDesigns: Models.ExperimentalDesign[], isLocked: boolean, onRowClick: (row: any, data: any) => void, onItemClick: (data) => void, onDesignChanged: (design: Models.ExperimentalDesign) => void): Framework.Form.DataTableParameters {

            let experimentalDesignColumns = [
                { data: "Name", title: Framework.LocalizationManager.Get("ExperimentalDesignName1") },
                {
                    data: "Type", title: Framework.LocalizationManager.Get("ExperimentalDesignType"), render: function (data, type, row) {
                        if (type === 'display') {
                            return Framework.LocalizationManager.Get(data);
                        }
                        return data;
                    }
                },
                {
                    data: "Order", title: Framework.LocalizationManager.Get("ExperimentalDesignOrder"), render: function (data, type, row) {
                        if (type === 'display') {
                            return Framework.LocalizationManager.Get(data);
                        }
                        return data;
                    }
                },
                {
                    data: "NbReplicates", title: Framework.LocalizationManager.Get("NbReplicates1"), render: function (data, type, row) {
                        if ((<Models.ExperimentalDesign>row).Type != "Product") {
                            return "-";
                        }
                        if (data == null || data == undefined) {
                            data = 1;
                        }
                        return data;
                    }
                },
                {
                    data: "NbIntakes", title: Framework.LocalizationManager.Get("NbIntakes1"), render: function (data, type, row) {
                        if ((<Models.ExperimentalDesign>row).Type != "Product") {
                            return "-";
                        }
                        if (data == null || data == undefined) {
                            data = 1;
                        }
                        return data;
                    }
                },
                {
                    data: "Items", title: Framework.LocalizationManager.Get("Items"), render: function (data, type, row) {
                        if (row && type === 'display') {
                            let codes = row.ListItemLabels.map((x) => { return x.Code });
                            if (codes.length > 0) {
                                return '<i class="fas fa-edit" ></i> ' + Framework.Array.Unique(codes).join(', ');
                            } else {
                                return '<span style="color:orange;font-weight:bold">' + Framework.LocalizationManager.Format("ClickToAdd", [row.Type]) + "</span>";
                            }
                        }
                        return "";
                    }
                }

            ];

            let experimentalDesignTableParameters = new Framework.Form.DataTableParameters();
            experimentalDesignTableParameters.ListData = listExperimentalDesigns;
            experimentalDesignTableParameters.ListColumns = experimentalDesignColumns;
            experimentalDesignTableParameters.Order = [[0, 'desc']];
            experimentalDesignTableParameters.OnRowClick = onRowClick;

            let numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];

            experimentalDesignTableParameters.OnEditCell = (propertyName, data) => {
                if (isLocked == true) {
                    return;
                }

                // On ne laisse pas la possibilité de changer le type pour éviter les confusions entre type d'items (supprimer et créer un nouveau)

                if (propertyName == "Name") {
                    //TODO : check length > 0
                    return Framework.Form.InputText.Create(data["Name"], (x, y) => {
                        if (y.IsValid == true) {
                            data["Name"] = x;
                        }
                    }, Framework.Form.Validator.Unique(listExperimentalDesigns.map((z) => { return z.Name; })), false, ["tableInput"]).HtmlElement;
                }

                if (propertyName == "Order") {
                    return Framework.Form.Select.Render(data["Order"], Framework.KeyValuePair.FromArray(Models.ExperimentalDesign.ExperimentalDesignOrderEnum), Framework.Form.Validator.NotEmpty(), (x) => {
                        (<Models.ExperimentalDesign>data).SetOrder(x);
                        onDesignChanged(<Models.ExperimentalDesign>data);
                    }, false, ["tableInput"]).HtmlElement;
                }

                if (propertyName == "NbReplicates") {
                    //TODO : input numeric updown
                    //TODO : create / remove new lines
                    return Framework.Form.Select.Render(data["NbReplicates"], Framework.KeyValuePair.FromArray(numbers), Framework.Form.Validator.IsNumber("Positive"), (x) => {
                        (<Models.ExperimentalDesign>data).SetReplicates(x);
                        onDesignChanged(<Models.ExperimentalDesign>data);
                    }, false, ["tableInput"]).HtmlElement;
                }

                if (propertyName == "NbIntakes") {
                    //TODO : input numeric updown
                    //TODO : create / remove new lines
                    return Framework.Form.Select.Render(data["NbIntakes"], Framework.KeyValuePair.FromArray(numbers), Framework.Form.Validator.IsNumber("Positive"), (x) => {
                        data["NbIntakes"] = x;
                    }, false, ["tableInput"]).HtmlElement;
                }

                if (propertyName == "Items") {
                    onItemClick(data);
                }

            }

            return experimentalDesignTableParameters;
        }

        public GetProperties(listDesignNames: string[], showAdditional: boolean = true, onAddItem: () => void = undefined): Framework.Form.PropertyEditor[] {

            let design = this;

            let checkState = () => {
                //if (t1 && t2 && t3) {
                //    if (design.NbReplicates < 2) {
                //        t1.Disable();
                //        t2.Disable();
                //        t3.Disable();
                //    } else {
                //        t1.Enable();
                //        t2.Enable();
                //        t3.Enable();
                //    }
                //}
            }

            let res: Framework.Form.PropertyEditor[] = [];

            if (showAdditional == true) {
                res.push(Framework.Form.PropertyEditorWithTextInput.Render("", "Name", design.Name, (x) => {
                    design.Name = x;
                }, Framework.Form.Validator.Unique(listDesignNames)));
            }

            if (onAddItem) {
                let title = "";
                if (design.Type == "Product") {
                    title = "NbProducts";
                }
                if (design.Type == "Attribute") {
                    title = "NbAttributes";
                }
                res.push(Framework.Form.PropertyEditorWithNumericUpDown.Render("", title, design.NbItems, 1, 50, (x) => {
                    if (onAddItem) {
                        design.ListItems = [];
                        for (let i = 1; i <= x; i++) {
                            onAddItem();
                        }
                    }
                }, 1));
            }

            //if (display.indexOf("PresentationMode") > -1) {
            if (showAdditional == true && design.Type == "Product") {
                if (design.PresentationMode == "") {
                    design.PresentationMode = "Single";
                }
                //res.push(Framework.Form.PropertyEditorWithPopup.Render("", "PresentationMode", design.PresentationMode, Models.ExperimentalDesign.PresentationModeEnum, (x) => {
                //    if (x != design.PresentationMode) {
                //        design.PresentationMode = x;
                //        design.ResetLabels();
                //    }
                //}));
            }

            //if (display.indexOf("Order") > -1) {
            res.push(Framework.Form.PropertyEditorWithPopup.Render("", "Order", design.Order, Models.ExperimentalDesign.ExperimentalDesignOrderEnum, (x) => {
                design.SetOrder(x);
            }));
            //}

            //if (display.indexOf("Replicates") > -1) {
            if (design.Type == "Product") {
                res.push(Framework.Form.PropertyEditorWithNumericUpDown.Render("", "Replicates", design.NbReplicates, 1, 30, (x) => {
                    design.SetReplicates(x);
                    checkState();
                }, 1));
            }

            //if (display.indexOf("Intakes") > -1) {
            if (design.Type == "Product") {
                res.push(Framework.Form.PropertyEditorWithNumericUpDown.Render("", "Intakes", design.NbIntakes, 1, 30, (x) => {
                    design.SetIntakes(x);
                }, 1));
            }

            //let t1 = Framework.Form.PropertyEditorWithToggle.Render("", "KeepRanksBetweenReplicates", design.KeepRanksBetweenReplicates, (x) => {
            //    design.KeepRanksBetweenReplicates = x;
            //    //TODO
            //});

            ////if (display.indexOf("KeepRanksBetweenReplicates") > -1) {
            //if (showAdditional == true && design.Type == "Product") {
            //    res.push(t1);
            //}

            //let t2 = Framework.Form.PropertyEditorWithToggle.Render("", "NoConsecutiveItems", design.NoConsecutiveItems, (x) => {
            //    design.NoConsecutiveItems = x;
            //    //TODO
            //});

            ////if (display.indexOf("NoConsecutiveItems") > -1) {
            //if (showAdditional == true && design.Type == "Product") {
            //    res.push(t2);
            //}

            //let t3 = Framework.Form.PropertyEditorWithToggle.Render("", "ShuffleReplicates", design.ShuffleReplicates, (x) => {
            //    design.ShuffleReplicates = x;
            //    //TODO
            //});

            ////if (display.indexOf("ShuffleReplicates") > -1) {
            //if (showAdditional == true && design.Type == "Product") {
            //    res.push(t3);
            //}

            checkState();

            return res;
        }

        public static WilliamsLatinSquare = [
            {
                items: 0, array:
                    [

                    ]
            },
            {
                items: 1, array:
                    [
                        [1]
                    ]
            },
            {
                items: 2, array:
                    [
                        [1, 2], [2, 1]
                    ]
            },
            {
                items: 3, array:
                    [
                        [1, 2, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1], [1, 3, 2], [2, 1, 3]
                    ]
            },
            {
                items: 4, array:
                    [
                        [1, 2, 4, 3], [2, 3, 1, 4], [3, 4, 2, 1], [4, 1, 3, 2]
                    ]
            },
            {
                items: 5, array:
                    [
                        [1, 2, 5, 3, 4], [2, 3, 1, 4, 5], [3, 4, 2, 5, 1], [4, 5, 3, 1, 2], [5, 1, 4, 2, 3], [4, 3, 5, 2, 1], [5, 4, 1, 3, 2], [1, 5, 2, 4, 3], [2, 1, 3, 5, 4], [3, 2, 4, 1, 5]
                    ]
            },
            {
                items: 6, array:
                    [
                        [1, 2, 6, 3, 5, 4], [2, 3, 1, 4, 6, 5], [3, 4, 2, 5, 1, 6], [4, 5, 3, 6, 2, 1], [5, 6, 4, 1, 3, 2], [6, 1, 5, 2, 4, 3]
                    ]
            },
            {
                items: 7, array:
                    [
                        [1, 2, 7, 3, 6, 4, 5], [2, 3, 1, 4, 7, 5, 6], [3, 4, 2, 5, 1, 6, 7], [4, 5, 3, 6, 2, 7, 1], [5, 6, 4, 7, 3, 1, 2], [6, 7, 5, 1, 4, 2, 3], [7, 1, 6, 2, 5, 3, 4], [5, 4, 6, 3, 7, 2, 1], [6, 5, 7, 4, 1, 3, 2], [7, 6, 1, 5, 2, 4, 3], [1, 7, 2, 6, 3, 5, 4], [2, 1, 3, 7, 4, 6, 5], [3, 2, 4, 1, 5, 7, 6], [4, 3, 5, 2, 6, 1, 7]
                    ]
            },
            {
                items: 8, array:
                    [
                        [1, 2, 8, 3, 7, 4, 6, 5], [2, 3, 1, 4, 8, 5, 7, 6], [3, 4, 2, 5, 1, 6, 8, 7], [4, 5, 3, 6, 2, 7, 1, 8], [5, 6, 4, 7, 3, 8, 2, 1], [6, 7, 5, 8, 4, 1, 3, 2], [7, 8, 6, 1, 5, 2, 4, 3], [8, 1, 7, 2, 6, 3, 5, 4]
                    ]
            },
            {
                items: 9, array:
                    [
                        [1, 2, 9, 3, 8, 4, 7, 5, 6], [2, 3, 1, 4, 9, 5, 8, 6, 7], [3, 4, 2, 5, 1, 6, 9, 7, 8], [4, 5, 3, 6, 2, 7, 1, 8, 9], [5, 6, 4, 7, 3, 8, 2, 9, 1], [6, 7, 5, 8, 4, 9, 3, 1, 2], [7, 8, 6, 9, 5, 1, 4, 2, 3], [8, 9, 7, 1, 6, 2, 5, 3, 4], [9, 1, 8, 2, 7, 3, 6, 4, 5], [6, 5, 7, 4, 8, 3, 9, 2, 1], [7, 6, 8, 5, 9, 4, 1, 3, 2], [8, 7, 9, 6, 1, 5, 2, 4, 3], [9, 8, 1, 7, 2, 6, 3, 5, 4], [1, 9, 2, 8, 3, 7, 4, 6, 5], [2, 1, 3, 9, 4, 8, 5, 7, 6], [3, 2, 4, 1, 5, 9, 6, 8, 7], [4, 3, 5, 2, 6, 1, 7, 9, 8], [5, 4, 6, 3, 7, 2, 8, 1, 9]
                    ]
            },
            {
                items: 10, array:
                    [
                        [1, 2, 10, 3, 9, 4, 8, 5, 7, 6], [2, 3, 1, 4, 10, 5, 9, 6, 8, 7], [3, 4, 2, 5, 1, 6, 10, 7, 9, 8], [4, 5, 3, 6, 2, 7, 1, 8, 10, 9], [5, 6, 4, 7, 3, 8, 2, 9, 1, 10], [6, 7, 5, 8, 4, 9, 3, 10, 2, 1], [7, 8, 6, 9, 5, 10, 4, 1, 3, 2], [8, 9, 7, 10, 6, 1, 5, 2, 4, 3], [9, 10, 8, 1, 7, 2, 6, 3, 5, 4], [10, 1, 9, 2, 8, 3, 7, 4, 6, 5]
                    ]
            },
            {
                items: 11, array:
                    [
                        [1, 2, 11, 3, 10, 4, 9, 5, 8, 6, 7], [2, 3, 1, 4, 11, 5, 10, 6, 9, 7, 8], [3, 4, 2, 5, 1, 6, 11, 7, 10, 8, 9], [4, 5, 3, 6, 2, 7, 1, 8, 11, 9, 10], [5, 6, 4, 7, 3, 8, 2, 9, 1, 10, 11], [6, 7, 5, 8, 4, 9, 3, 10, 2, 11, 1], [7, 8, 6, 9, 5, 10, 4, 11, 3, 1, 2], [8, 9, 7, 10, 6, 11, 5, 1, 4, 2, 3], [9, 10, 8, 11, 7, 1, 6, 2, 5, 3, 4], [10, 11, 9, 1, 8, 2, 7, 3, 6, 4, 5], [11, 1, 10, 2, 9, 3, 8, 4, 7, 5, 6], [7, 6, 8, 5, 9, 4, 10, 3, 11, 2, 1], [8, 7, 9, 6, 10, 5, 11, 4, 1, 3, 2], [9, 8, 10, 7, 11, 6, 1, 5, 2, 4, 3], [10, 9, 11, 8, 1, 7, 2, 6, 3, 5, 4], [11, 10, 1, 9, 2, 8, 3, 7, 4, 6, 5], [1, 11, 2, 10, 3, 9, 4, 8, 5, 7, 6], [2, 1, 3, 11, 4, 10, 5, 9, 6, 8, 7], [3, 2, 4, 1, 5, 11, 6, 10, 7, 9, 8], [4, 3, 5, 2, 6, 1, 7, 11, 8, 10, 9], [5, 4, 6, 3, 7, 2, 8, 1, 9, 11, 10], [6, 5, 7, 4, 8, 3, 9, 2, 10, 1, 11]
                    ]
            },
            {
                items: 12, array:
                    [
                        [1, 2, 12, 3, 11, 4, 10, 5, 9, 6, 8, 7], [2, 3, 1, 4, 12, 5, 11, 6, 10, 7, 9, 8], [3, 4, 2, 5, 1, 6, 12, 7, 11, 8, 10, 9], [4, 5, 3, 6, 2, 7, 1, 8, 12, 9, 11, 10], [5, 6, 4, 7, 3, 8, 2, 9, 1, 10, 12, 11], [6, 7, 5, 8, 4, 9, 3, 10, 2, 11, 1, 12], [7, 8, 6, 9, 5, 10, 4, 11, 3, 12, 2, 1], [8, 9, 7, 10, 6, 11, 5, 12, 4, 1, 3, 2], [9, 10, 8, 11, 7, 12, 6, 1, 5, 2, 4, 3], [10, 11, 9, 12, 8, 1, 7, 2, 6, 3, 5, 4], [11, 12, 10, 1, 9, 2, 8, 3, 7, 4, 6, 5], [12, 1, 11, 2, 10, 3, 9, 4, 8, 5, 7, 6]
                    ]
            },
            {
                items: 13, array:
                    [
                        [1, 2, 13, 3, 12, 4, 11, 5, 10, 6, 9, 7, 8], [2, 3, 1, 4, 13, 5, 12, 6, 11, 7, 10, 8, 9], [3, 4, 2, 5, 1, 6, 13, 7, 12, 8, 11, 9, 10], [4, 5, 3, 6, 2, 7, 1, 8, 13, 9, 12, 10, 11], [5, 6, 4, 7, 3, 8, 2, 9, 1, 10, 13, 11, 12], [6, 7, 5, 8, 4, 9, 3, 10, 2, 11, 1, 12, 13], [7, 8, 6, 9, 5, 10, 4, 11, 3, 12, 2, 13, 1], [8, 9, 7, 10, 6, 11, 5, 12, 4, 13, 3, 1, 2], [9, 10, 8, 11, 7, 12, 6, 13, 5, 1, 4, 2, 3], [10, 11, 9, 12, 8, 13, 7, 1, 6, 2, 5, 3, 4], [11, 12, 10, 13, 9, 1, 8, 2, 7, 3, 6, 4, 5], [12, 13, 11, 1, 10, 2, 9, 3, 8, 4, 7, 5, 6], [13, 1, 12, 2, 11, 3, 10, 4, 9, 5, 8, 6, 7], [8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 1], [9, 8, 10, 7, 11, 6, 12, 5, 13, 4, 1, 3, 2], [10, 9, 11, 8, 12, 7, 13, 6, 1, 5, 2, 4, 3], [11, 10, 12, 9, 13, 8, 1, 7, 2, 6, 3, 5, 4], [12, 11, 13, 10, 1, 9, 2, 8, 3, 7, 4, 6, 5], [13, 12, 1, 11, 2, 10, 3, 9, 4, 8, 5, 7, 6], [1, 13, 2, 12, 3, 11, 4, 10, 5, 9, 6, 8, 7], [2, 1, 3, 13, 4, 12, 5, 11, 6, 10, 7, 9, 8], [3, 2, 4, 1, 5, 13, 6, 12, 7, 11, 8, 10, 9], [4, 3, 5, 2, 6, 1, 7, 13, 8, 12, 9, 11, 10], [5, 4, 6, 3, 7, 2, 8, 1, 9, 13, 10, 12, 11], [6, 5, 7, 4, 8, 3, 9, 2, 10, 1, 11, 13, 12], [7, 6, 8, 5, 9, 4, 10, 3, 11, 2, 12, 1, 13]
                    ]
            },
            {
                items: 14, array:
                    [
                        [1, 2, 14, 3, 13, 4, 12, 5, 11, 6, 10, 7, 9, 8], [2, 3, 1, 4, 14, 5, 13, 6, 12, 7, 11, 8, 10, 9], [3, 4, 2, 5, 1, 6, 14, 7, 13, 8, 12, 9, 11, 10], [4, 5, 3, 6, 2, 7, 1, 8, 14, 9, 13, 10, 12, 11], [5, 6, 4, 7, 3, 8, 2, 9, 1, 10, 14, 11, 13, 12], [6, 7, 5, 8, 4, 9, 3, 10, 2, 11, 1, 12, 14, 13], [7, 8, 6, 9, 5, 10, 4, 11, 3, 12, 2, 13, 1, 14], [8, 9, 7, 10, 6, 11, 5, 12, 4, 13, 3, 14, 2, 1], [9, 10, 8, 11, 7, 12, 6, 13, 5, 14, 4, 1, 3, 2], [10, 11, 9, 12, 8, 13, 7, 14, 6, 1, 5, 2, 4, 3], [11, 12, 10, 13, 9, 14, 8, 1, 7, 2, 6, 3, 5, 4], [12, 13, 11, 14, 10, 1, 9, 2, 8, 3, 7, 4, 6, 5], [13, 14, 12, 1, 11, 2, 10, 3, 9, 4, 8, 5, 7, 6], [14, 1, 13, 2, 12, 3, 11, 4, 10, 5, 9, 6, 8, 7]
                    ]
            },
            {
                items: 15, array:
                    [
                        [1, 2, 15, 3, 14, 4, 13, 5, 12, 6, 11, 7, 10, 8, 9], [2, 3, 1, 4, 15, 5, 14, 6, 13, 7, 12, 8, 11, 9, 10], [3, 4, 2, 5, 1, 6, 15, 7, 14, 8, 13, 9, 12, 10, 11], [4, 5, 3, 6, 2, 7, 1, 8, 15, 9, 14, 10, 13, 11, 12], [5, 6, 4, 7, 3, 8, 2, 9, 1, 10, 15, 11, 14, 12, 13], [6, 7, 5, 8, 4, 9, 3, 10, 2, 11, 1, 12, 15, 13, 14], [7, 8, 6, 9, 5, 10, 4, 11, 3, 12, 2, 13, 1, 14, 15], [8, 9, 7, 10, 6, 11, 5, 12, 4, 13, 3, 14, 2, 15, 1], [9, 10, 8, 11, 7, 12, 6, 13, 5, 14, 4, 15, 3, 1, 2], [10, 11, 9, 12, 8, 13, 7, 14, 6, 15, 5, 1, 4, 2, 3], [11, 12, 10, 13, 9, 14, 8, 15, 7, 1, 6, 2, 5, 3, 4], [12, 13, 11, 14, 10, 15, 9, 1, 8, 2, 7, 3, 6, 4, 5], [13, 14, 12, 15, 11, 1, 10, 2, 9, 3, 8, 4, 7, 5, 6], [14, 15, 13, 1, 12, 2, 11, 3, 10, 4, 9, 5, 8, 6, 7], [15, 1, 14, 2, 13, 3, 12, 4, 11, 5, 10, 6, 9, 7, 8], [9, 8, 10, 7, 11, 6, 12, 5, 13, 4, 14, 3, 15, 2, 1], [10, 9, 11, 8, 12, 7, 13, 6, 14, 5, 15, 4, 1, 3, 2], [11, 10, 12, 9, 13, 8, 14, 7, 15, 6, 1, 5, 2, 4, 3], [12, 11, 13, 10, 14, 9, 15, 8, 1, 7, 2, 6, 3, 5, 4], [13, 12, 14, 11, 15, 10, 1, 9, 2, 8, 3, 7, 4, 6, 5], [14, 13, 15, 12, 1, 11, 2, 10, 3, 9, 4, 8, 5, 7, 6], [15, 14, 1, 13, 2, 12, 3, 11, 4, 10, 5, 9, 6, 8, 7], [1, 15, 2, 14, 3, 13, 4, 12, 5, 11, 6, 10, 7, 9, 8], [2, 1, 3, 15, 4, 14, 5, 13, 6, 12, 7, 11, 8, 10, 9], [3, 2, 4, 1, 5, 15, 6, 14, 7, 13, 8, 12, 9, 11, 10], [4, 3, 5, 2, 6, 1, 7, 15, 8, 14, 9, 13, 10, 12, 11], [5, 4, 6, 3, 7, 2, 8, 1, 9, 15, 10, 14, 11, 13, 12], [6, 5, 7, 4, 8, 3, 9, 2, 10, 1, 11, 15, 12, 14, 13], [7, 6, 8, 5, 9, 4, 10, 3, 11, 2, 12, 1, 13, 15, 14], [8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
                    ]
            },
            {
                items: 16, array:
                    [
                        [1, 2, 16, 3, 15, 4, 14, 5, 13, 6, 12, 7, 11, 8, 10, 9], [2, 3, 1, 4, 16, 5, 15, 6, 14, 7, 13, 8, 12, 9, 11, 10], [3, 4, 2, 5, 1, 6, 16, 7, 15, 8, 14, 9, 13, 10, 12, 11], [4, 5, 3, 6, 2, 7, 1, 8, 16, 9, 15, 10, 14, 11, 13, 12], [5, 6, 4, 7, 3, 8, 2, 9, 1, 10, 16, 11, 15, 12, 14, 13], [6, 7, 5, 8, 4, 9, 3, 10, 2, 11, 1, 12, 16, 13, 15, 14], [7, 8, 6, 9, 5, 10, 4, 11, 3, 12, 2, 13, 1, 14, 16, 15], [8, 9, 7, 10, 6, 11, 5, 12, 4, 13, 3, 14, 2, 15, 1, 16], [9, 10, 8, 11, 7, 12, 6, 13, 5, 14, 4, 15, 3, 16, 2, 1], [10, 11, 9, 12, 8, 13, 7, 14, 6, 15, 5, 16, 4, 1, 3, 2], [11, 12, 10, 13, 9, 14, 8, 15, 7, 16, 6, 1, 5, 2, 4, 3], [12, 13, 11, 14, 10, 15, 9, 16, 8, 1, 7, 2, 6, 3, 5, 4], [13, 14, 12, 15, 11, 16, 10, 1, 9, 2, 8, 3, 7, 4, 6, 5], [14, 15, 13, 16, 12, 1, 11, 2, 10, 3, 9, 4, 8, 5, 7, 6], [15, 16, 14, 1, 13, 2, 12, 3, 11, 4, 10, 5, 9, 6, 8, 7], [16, 1, 15, 2, 14, 3, 13, 4, 12, 5, 11, 6, 10, 7, 9, 8]
                    ]
            },
            {
                items: 17, array:
                    [
                        [1, 2, 17, 3, 16, 4, 15, 5, 14, 6, 13, 7, 12, 8, 11, 9, 10], [2, 3, 1, 4, 17, 5, 16, 6, 15, 7, 14, 8, 13, 9, 12, 10, 11], [3, 4, 2, 5, 1, 6, 17, 7, 16, 8, 15, 9, 14, 10, 13, 11, 12], [4, 5, 3, 6, 2, 7, 1, 8, 17, 9, 16, 10, 15, 11, 14, 12, 13], [5, 6, 4, 7, 3, 8, 2, 9, 1, 10, 17, 11, 16, 12, 15, 13, 14], [6, 7, 5, 8, 4, 9, 3, 10, 2, 11, 1, 12, 17, 13, 16, 14, 15], [7, 8, 6, 9, 5, 10, 4, 11, 3, 12, 2, 13, 1, 14, 17, 15, 16], [8, 9, 7, 10, 6, 11, 5, 12, 4, 13, 3, 14, 2, 15, 1, 16, 17], [9, 10, 8, 11, 7, 12, 6, 13, 5, 14, 4, 15, 3, 16, 2, 17, 1], [10, 11, 9, 12, 8, 13, 7, 14, 6, 15, 5, 16, 4, 17, 3, 1, 2], [11, 12, 10, 13, 9, 14, 8, 15, 7, 16, 6, 17, 5, 1, 4, 2, 3], [12, 13, 11, 14, 10, 15, 9, 16, 8, 17, 7, 1, 6, 2, 5, 3, 4], [13, 14, 12, 15, 11, 16, 10, 17, 9, 1, 8, 2, 7, 3, 6, 4, 5], [14, 15, 13, 16, 12, 17, 11, 1, 10, 2, 9, 3, 8, 4, 7, 5, 6], [15, 16, 14, 17, 13, 1, 12, 2, 11, 3, 10, 4, 9, 5, 8, 6, 7], [16, 17, 15, 1, 14, 2, 13, 3, 12, 4, 11, 5, 10, 6, 9, 7, 8], [17, 1, 16, 2, 15, 3, 14, 4, 13, 5, 12, 6, 11, 7, 10, 8, 9], [10, 9, 11, 8, 12, 7, 13, 6, 14, 5, 15, 4, 16, 3, 17, 2, 1], [11, 10, 12, 9, 13, 8, 14, 7, 15, 6, 16, 5, 17, 4, 1, 3, 2], [12, 11, 13, 10, 14, 9, 15, 8, 16, 7, 17, 6, 1, 5, 2, 4, 3], [13, 12, 14, 11, 15, 10, 16, 9, 17, 8, 1, 7, 2, 6, 3, 5, 4], [14, 13, 15, 12, 16, 11, 17, 10, 1, 9, 2, 8, 3, 7, 4, 6, 5], [15, 14, 16, 13, 17, 12, 1, 11, 2, 10, 3, 9, 4, 8, 5, 7, 6], [16, 15, 17, 14, 1, 13, 2, 12, 3, 11, 4, 10, 5, 9, 6, 8, 7], [17, 16, 1, 15, 2, 14, 3, 13, 4, 12, 5, 11, 6, 10, 7, 9, 8], [1, 17, 2, 16, 3, 15, 4, 14, 5, 13, 6, 12, 7, 11, 8, 10, 9], [2, 1, 3, 17, 4, 16, 5, 15, 6, 14, 7, 13, 8, 12, 9, 11, 10], [3, 2, 4, 1, 5, 17, 6, 16, 7, 15, 8, 14, 9, 13, 10, 12, 11], [4, 3, 5, 2, 6, 1, 7, 17, 8, 16, 9, 15, 10, 14, 11, 13, 12], [5, 4, 6, 3, 7, 2, 8, 1, 9, 17, 10, 16, 11, 15, 12, 14, 13], [6, 5, 7, 4, 8, 3, 9, 2, 10, 1, 11, 17, 12, 16, 13, 15, 14], [7, 6, 8, 5, 9, 4, 10, 3, 11, 2, 12, 1, 13, 17, 14, 16, 15], [8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15, 17, 16], [9, 8, 10, 7, 11, 6, 12, 5, 13, 4, 14, 3, 15, 2, 16, 1, 17]
                    ]
            },
            {
                items: 18, array:
                    [
                        [1, 2, 18, 3, 17, 4, 16, 5, 15, 6, 14, 7, 13, 8, 12, 9, 11, 10], [2, 3, 1, 4, 18, 5, 17, 6, 16, 7, 15, 8, 14, 9, 13, 10, 12, 11], [3, 4, 2, 5, 1, 6, 18, 7, 17, 8, 16, 9, 15, 10, 14, 11, 13, 12], [4, 5, 3, 6, 2, 7, 1, 8, 18, 9, 17, 10, 16, 11, 15, 12, 14, 13], [5, 6, 4, 7, 3, 8, 2, 9, 1, 10, 18, 11, 17, 12, 16, 13, 15, 14], [6, 7, 5, 8, 4, 9, 3, 10, 2, 11, 1, 12, 18, 13, 17, 14, 16, 15], [7, 8, 6, 9, 5, 10, 4, 11, 3, 12, 2, 13, 1, 14, 18, 15, 17, 16], [8, 9, 7, 10, 6, 11, 5, 12, 4, 13, 3, 14, 2, 15, 1, 16, 18, 17], [9, 10, 8, 11, 7, 12, 6, 13, 5, 14, 4, 15, 3, 16, 2, 17, 1, 18], [10, 11, 9, 12, 8, 13, 7, 14, 6, 15, 5, 16, 4, 17, 3, 18, 2, 1], [11, 12, 10, 13, 9, 14, 8, 15, 7, 16, 6, 17, 5, 18, 4, 1, 3, 2], [12, 13, 11, 14, 10, 15, 9, 16, 8, 17, 7, 18, 6, 1, 5, 2, 4, 3], [13, 14, 12, 15, 11, 16, 10, 17, 9, 18, 8, 1, 7, 2, 6, 3, 5, 4], [14, 15, 13, 16, 12, 17, 11, 18, 10, 1, 9, 2, 8, 3, 7, 4, 6, 5], [15, 16, 14, 17, 13, 18, 12, 1, 11, 2, 10, 3, 9, 4, 8, 5, 7, 6], [16, 17, 15, 18, 14, 1, 13, 2, 12, 3, 11, 4, 10, 5, 9, 6, 8, 7], [17, 18, 16, 1, 15, 2, 14, 3, 13, 4, 12, 5, 11, 6, 10, 7, 9, 8], [18, 1, 17, 2, 16, 3, 15, 4, 14, 5, 13, 6, 12, 7, 11, 8, 10, 9]
                    ]
            }
            //TODO : continuer
        ];

        public Id: number;
        public Name: string;
        public Type: string;
        public ListExperimentalDesignRows: ExperimentalDesignRow[] = [];
        public Order: string;
        public CanAddItem: boolean = false;

        public PresentationMode: string = "Single";// Single (défaut, 1 produit à la fois), Pair (2 produits différents), Triangle (2 produits identiques et un différent), Tetrad (2 paires de produits identiques)
        public static PresentationModeEnum: string[] = ["Single", "Pair", "Triangle", "Tetrad", "TwoOutOfFive"];

        public ListItems: ExperimentalDesignItem[] = [];

        public RandomCodeGenerator: Framework.Random.Generator;

        constructor() {
            this.Order = "Fixed";
            this.NbReplicates = 1;
            this.NbIntakes = 1;
            this.ListExperimentalDesignRows = [];
            this.ListItems = [];
            this.PresentationMode = "Single";
            //HasChanges = false;
            //MaxReplicates = 100;
            //KeepRanksBetweenReplicates = false;
            //noConsecutiveItems = false;
            //isWilliamsLatinSquare = true;
            //isWithoutReplacement = true;
            //Seed = DateTime.Now.Millisecond;
            //DefinedByPanelist = false;

            this.RandomCodeGenerator = new Framework.Random.Generator();
        }

        public get NbItems(): number {
            return this.ListItems.length;
        }

        public get HasReplicates(): boolean {
            return this.NbReplicates > 1;
        }

        public NbReplicates: number = 1;

        public NbIntakes: number = 1;

        private subjects: string[] = [];

        public get Subjects(): string[] {
            if (this.subjects.length == 0) {
                return this.getSubjects(this.ListExperimentalDesignRows);
            }
            return this.subjects;
        }

        public GetSubjectItems(subjectCode: string): Framework.KeyValuePair[] {
            return this.ListExperimentalDesignRows.filter((x) => { return x.SubjectCode == subjectCode }).sort((a, b) => { return a.Rank - b.Rank }).map((x) => { return new Framework.KeyValuePair(x.Code, x.Label) });
        }

        public GetLabels(): string[] {
            let res = [];
            this.ListItems.forEach((x) => {
                x.Labels.forEach((kvp) => {
                    res.push(kvp.Value);
                });
            });
            return res;
        }

        public static GetCode(row: ExperimentalDesignRow): string {
            if (row.Code.length > 0) {
                return row.Code;
            }
            if (row["ProductCode"]) {
                return (<ProductExperimentalDesignRow>row).ProductCode;
            }
            if (row["AttributeCode"]) {
                return (<AttributeExperimentalDesignRow>row).AttributeCode;
            }
            return "";
        }

        public SetItemRank(itemCode: string, replicate: number, newRank: number, subjectCode: string = "*") {

            let design: ExperimentalDesign = this;

            let rows = design.ListExperimentalDesignRows;
            if (subjectCode != "*") {
                rows = rows.filter((x) => { return x.SubjectCode == subjectCode; });
            }

            let subjects = [];
            rows.forEach((x) => {
                subjects.push(x.SubjectCode);
            }
            );
            subjects = Framework.Array.Unique(subjects);

            subjects.forEach((x) => {
                let subjectsRows = rows.filter((y) => { return x == y.SubjectCode; });
                let itemRow = subjectsRows.filter((y) => { return ExperimentalDesign.GetCode(y) == itemCode && y.Replicate == replicate; })[0];
                let oldItemRank = itemRow.Rank;
                let itemAtNewRanks = subjectsRows.filter((y) => { return y.Rank == newRank; });
                itemRow.Rank = newRank;
                if (newRank > 0 && oldItemRank > 0) {
                    itemAtNewRanks.forEach((x) => {
                        x.Rank = oldItemRank;
                    });
                }
            });
        }

        public UpdateItemLabel(oldCode: string, newCode: string, replicate: number, newLabel: string, oldLabel: string) {
            let items: ExperimentalDesignItem[] = [];
            let rows: ExperimentalDesignRow[] = [];

            if (this.PresentationMode == "Single" || this.PresentationMode == "Pair") {
                items = this.ListItems.filter((y) => { return y.Code == oldCode });

            }

            if (this.PresentationMode == "Triangle" || this.PresentationMode == "Tetrad" || this.PresentationMode == "TwoOutOfFive") {
                items = this.ListItems.filter((y) => {
                    let codes = y.Code.split('|');
                    return codes.indexOf(oldCode) > -1;
                });
            }

            if (this.PresentationMode == "Single") {
                rows = this.ListExperimentalDesignRows.filter((y) => { return y.Code == oldCode });
            }

            if (this.PresentationMode == "Pair" || this.PresentationMode == "Triangle" || this.PresentationMode == "Tetrad" || this.PresentationMode == "TwoOutOfFive") {
                rows = this.ListExperimentalDesignRows.filter((y) => {
                    let codes = y.Code.split('|');
                    return codes.indexOf(oldCode) > -1;
                });
            }

            //TOCHECK
            if (replicate) {
                //labels = labels.filter((x) => {
                //    x.Labels.forEach((y) => {
                //        return y.Key == replicate;
                //    })

                //});
                rows = rows.filter((x) => { return x.Replicate == replicate; });
            }

            if (newCode) {
                items.forEach((x) => { x.Code = newCode });
                if (this.PresentationMode == "Single") {
                    rows.forEach((x) => { x.Code = newCode });
                }
                if (this.PresentationMode == "Pair" || this.PresentationMode == "Triangle" || this.PresentationMode == "Tetrad" || this.PresentationMode == "TwoOutOfFive") {
                    rows.forEach((x) => {
                        let codes = x.Code.split('|');
                        codes.forEach(function (code, i) { if (code == oldCode) codes[i] = newCode; });
                        x.Code = codes.join('|');
                    });
                }
            }

            if (newLabel != undefined) {

                if (this.PresentationMode == "Single" || this.PresentationMode == "Pair") {

                    items.forEach((item) => {
                        item.Labels.forEach((kvp) => {
                            if (kvp.Key == replicate) {
                                kvp.Value = newLabel;
                            }
                        });
                    });
                }

                if (this.PresentationMode == "Triangle" || this.PresentationMode == "Tetrad" || this.PresentationMode == "TwoOutOfFive") {

                    items.forEach((item) => {
                        item.Labels.forEach((kvp) => {
                            if (kvp.Key == replicate) {
                                let tabLabels = kvp.Value.split('|');
                                tabLabels.forEach(function (label, i) { if (label == oldLabel) tabLabels[i] = newLabel; });
                                kvp.Value = tabLabels.join('|');
                            }
                        });
                    });

                }

                if (this.PresentationMode == "Single") {
                    rows.forEach((x) => { x.Label = newLabel });
                }

                if (this.PresentationMode == "Pair" || this.PresentationMode == "Triangle" || this.PresentationMode == "Tetrad" || this.PresentationMode == "TwoOutOfFive") {
                    rows.forEach((x) => {
                        let labels = x.Label.split('|');
                        labels.forEach(function (label, i) { if (label == oldLabel) labels[i] = newLabel; });
                        x.Label = labels.join('|');
                    });
                }

            }
        }

        public GetProducts(): string[][] {

            let self = this;

            let res: string[][] = [];            
            
            let reps = Framework.Array.Unique(this.ListExperimentalDesignRows.map((x) => { return x.Replicate })).sort((a, b) => a - b);

            let titleRow = [];
            titleRow.push("Product");
            reps.forEach((rep) => {
                titleRow.push("replicate " + rep);
            });

            res.push(titleRow);

            this.ListItems.forEach(item => {
                let codeRow: string[] = [];
                codeRow.push(item.Code);

                item.Labels.forEach(label => {
                    codeRow.push(label.Value);
                });

                res.push(codeRow);                
            });
           
            return res;
        }

        public GetAsArray(): { CodeArray: string[][]; LabelArray: string[][] } {

            let self = this;

            let codeArray: string[][] = [];
            let labelArray: string[][] = [];

            let ranks = Framework.Array.Unique(this.ListExperimentalDesignRows.map((x) => { return x.Rank })).sort((a, b) => a - b);

            let titleRow = [];
            titleRow.push("Subject code");
            ranks.forEach((rank) => {
                titleRow.push("rank " + rank);
            });

            codeArray.push(titleRow);
            labelArray.push(titleRow);

            let res = [];

            this.getSubjects(this.ListExperimentalDesignRows).forEach((subject) => {
                let codeRow: string[] = [];
                codeRow.push(subject);
                let labelRow: string[] = [];
                labelRow.push(subject);
                ranks.forEach((rank) => {
                    let subjectData = self.ListExperimentalDesignRows.filter((x) => { return x.SubjectCode == subject && x.Rank == rank });
                    if (subjectData && subjectData.length > 0) {
                        codeRow.push(subjectData[0].Code);
                        labelRow.push(subjectData[0].Label);
                    }
                });
                codeArray.push(codeRow);
                labelArray.push(labelRow);
            });


            return { CodeArray: codeArray, LabelArray: labelArray };
        }

        public GetInlineTable(): Framework.Form.DataTableParameters {

            let self = this;

            let nbRanks = Framework.Array.Unique(self.ListExperimentalDesignRows.map((x) => { return x.Rank })).length;

            let experimentalDesignTableColumns = [
                { data: "SubjectCode", title: Framework.LocalizationManager.Get("SubjectCode"), render: undefined },
            ];

            for (let i = 1; i <= nbRanks; i++) {
                experimentalDesignTableColumns.push({
                    data: "Rank" + i,
                    title: Framework.LocalizationManager.Format("RankNumber", [i.toString()]),
                    render: function (data, type, row) {
                        if (data && type === 'display') {
                            let d: Models.ExperimentalDesignRow = JSON.parse(data);

                            let code: string = d.Code;
                            let label: string = d.Label;

                            if (self.Type == "Product") {
                                code = d.Code + " " + d.Replicate;
                            }

                            return "<div style='text-align:left'><span style='font-size:10px'>" + code + "</span><br/><span>" + label + "</span></div>";
                        }
                        return "";
                    }
                });
            }

            let experimentalDesignTableParameters = new Framework.Form.DataTableParameters();
            experimentalDesignTableParameters.Paging = false;
            experimentalDesignTableParameters.ListData = self.GetExperimentalDesignTable();
            experimentalDesignTableParameters.ListColumns = experimentalDesignTableColumns;
            experimentalDesignTableParameters.Order = [[0, 'asc']];

            return experimentalDesignTableParameters;

        }

        public GetExperimentalDesignTable(labelOnly: boolean = false): any[] {

            let design = this;

            //renvoie SubjectCode | Rep1 | Rep2 ...
            //Contenu de la cellule = Code + Replicate + Label
            let res = [];

            design.ListExperimentalDesignRows.forEach((x) => {
                let subjectCode = x.SubjectCode;
                let rank = x.Rank;

                let item;
                let items = res.filter((x) => { return x.SubjectCode == subjectCode });

                if (items.length == 0) {
                    item = [];
                    item["SubjectCode"] = subjectCode;
                    res.push(item);
                } else {
                    item = items[0];
                }

                if (labelOnly == false) {
                    item["Rank" + rank] = JSON.stringify(x);
                } else {
                    if (x["Label"]) {
                        item["Rank" + rank] = x["Label"];
                    }
                    else if (x["ProductLabel"]) {
                        item["Rank" + rank] = x["ProductLabel"];
                    }
                    else if (x["AttributeLabel"]) {
                        item["Rank" + rank] = x["AttributeLabel"];
                    }
                }

            });

            return res;
        }

        public SetIntakes(intakes: number) {
            this.NbIntakes = intakes;
            //TODO
        }

        public GetLabel(code: string, replicate: number): string {

            let res = undefined;

            let items = this.ListItems.filter((x) => {
                return x.Code == code;
            });
            if (items.length > 0) {

                items[0].Labels.forEach((kvp) => {
                    if (kvp.Key == replicate) {
                        res = kvp.Value;
                    }
                });
            }
            return res;
        }

        public SetLabel(code: string, replicate: number, label: string) {
            let items = this.ListItems.filter((x) => {
                return x.Code == code;
            });
            items[0].Labels.forEach((kvp) => {
                if (kvp.Key == replicate) {
                    kvp.Value = label;
                }
            });
        }

        public SetReplicates(rep: number) {

            //TODO : prise en compte modes prés produit

            // Suppression des rep existantes
            //let itemLabels = this.ListItemLabels.filter((x) => { return x.Replicate > rep });
            //itemLabels.forEach((x) => {
            //    Framework.Array.Remove(this.ListItemLabels, x);
            //});

            this.ListItems.forEach((x) => {
                for (let i = 0; i < x.Labels.length; i++) {
                    if (x.Labels[i].Key > rep) {
                        Framework.Array.Remove(x.Labels, x.Labels[i]);
                    }
                }
            });

            let rows = this.ListExperimentalDesignRows.filter((x) => { return x.Replicate > rep });
            rows.forEach((x) => {
                Framework.Array.Remove(this.ListExperimentalDesignRows, x);
            });

            let self = this;

            // Création des nouveaux libellés
            //let updatedItems = [];
            let newReplicates: number[] = [];
            for (var i = this.NbReplicates; i <= rep; i++) {
                let missingReplicate: boolean;
                this.ListItems.forEach((item) => {
                    if (self.GetLabel(item.Code, i) == undefined) {
                        let label = Framework.Random.Helper.GetUniqueRandomCodes(self.GetLabels(), 1, self.RandomCodeGenerator.IncludeDigits, self.RandomCodeGenerator.IncludeLowercases, self.RandomCodeGenerator.IncludeUppercases, self.RandomCodeGenerator.Length, 0.7)[0];
                        item.Labels.push(new Framework.KeyValuePair(i, label));
                        missingReplicate = true;
                    }
                });
                if (missingReplicate == true) {
                    newReplicates.push(i);
                }

                //if (this.ListItemLabels.filter((x) => { return x.Replicate == i }).length == 0) {

                //    let existingLabels = this.ListItemLabels.filter((y) => { return y.Replicate == 1 });
                //    existingLabels.forEach((y) => {
                //        let newItemLabel = new ItemLabel();
                //        newItemLabel.Code = y.Code;
                //        newItemLabel.Replicate = i;
                //        newItemLabel.Label = Framework.Random.GetUniqueRandomCodes(self.ListItemLabels.map((x) => { return x.Label; }), 1, this.RandomCodeGenerator.IncludeDigits, this.RandomCodeGenerator.IncludeLowercases, this.RandomCodeGenerator.IncludeUppercases, this.RandomCodeGenerator.Length, 0.7)[0];
                //        this.ListItemLabels.push(newItemLabel);
                //        createdLabels.push(newItemLabel);
                //    });
                //}
            }

            this.NbReplicates = rep;
            let createdRows = this.createRows(this.Subjects);



            this.setOrder(this.Order, createdRows);

        }

        public ResetLabels() {

            let self = this;

            let items = Framework.Factory.Clone(this.ListItems);
            this.ListItems = [];

            items.forEach((x) => {
                self.AddItem(x);
            });

            this.Reset();
        }

        public Reset() {
            let subjects = Framework.Factory.Clone(this.Subjects);
            this.ListExperimentalDesignRows = [];
            this.createRows(subjects);
            this.setOrder(this.Order, this.ListExperimentalDesignRows);
        }

        public SetOrder(order: string) {
            this.Order = order;
            this.setOrder(this.Order, this.ListExperimentalDesignRows);
        }

        private getReplicates(rows: ExperimentalDesignRow[]): number[] {
            if (rows == undefined || rows.length == 0) {
                return [1];
            }
            return Framework.Array.Unique(rows.map((x) => { return x.Replicate; }));
        }

        private getSubjects(rows: ExperimentalDesignRow[]): string[] {
            if (rows == undefined || rows.length == 0) {
                return [];
            }
            return Framework.Array.Unique(rows.map((x) => { return x.SubjectCode; }));
        }

        private setOrder(order: string, rows: ExperimentalDesignRow[]) {

            let self = this;

            

            let replicates = this.getReplicates(rows);
            let subjects = this.getSubjects(rows);
            let rowIndex = 0;
            let latinSquare = [];
            if (order == "WilliamsLatinSquare") {
                if (this.NbItems >= 19) {
                    order = "Random";
                    this.Order = order;
                    Framework.Modal.Alert(Framework.LocalizationManager.Get("Warning"), Framework.LocalizationManager.Get("TooMuchProductForAWilliamLatinSquare"))
                }
                else {
                    let latinSquares = ExperimentalDesign.WilliamsLatinSquare.filter((x) => { return x.items == this.NbItems });
                    latinSquare = latinSquares[0].array;
                    Framework.Array.Shuffle(latinSquare);
                }
            }

            for (var i = 0; i < replicates.length; i++) {
                for (var j = 0; j < subjects.length; j++) {
                    let rows = self.ListExperimentalDesignRows.filter((x) => {
                        return x.Replicate == replicates[i] && x.SubjectCode == subjects[j];
                    });
                    if (rows.length > 0) {

                        let rank: number = 1;
                        let replicateOffset = (replicates[i] - 1) * this.NbItems;

                        if (order == "Fixed") {
                            rows.forEach((x) => { x.Rank = rank + replicateOffset; rank++; });
                        }
                        if (order == "Random") {
                            Framework.Array.Shuffle(rows);
                            rows.forEach((x) => { x.Rank = rank + replicateOffset; rank++; });
                        }
                        if (order == "WilliamsLatinSquare") {
                            let rowOrder = latinSquare[rowIndex];
                            let index: number = 0;
                            rows.forEach((x) => {
                                x.Rank = rowOrder[index] + replicateOffset; index++;
                            });
                            rowIndex++;
                            if (rowIndex == latinSquare.length) {
                                rowIndex = 0;
                                Framework.Array.Shuffle(latinSquare);
                            }
                        }

                    }
                }
            }
        }

        public GetNewLabels(): ExperimentalDesignItem[] {
            let self = this;
            let items = Framework.Factory.Clone(this.ListItems);
            let nbLabels: number = this.ListItems.length * this.NbReplicates;
            if (this.PresentationMode == "Triangle" || this.PresentationMode == "Tetrad") {
                nbLabels *= 2;
            }
            let l = Framework.Random.Helper.GetUniqueRandomCodes([], nbLabels, this.RandomCodeGenerator.IncludeDigits, this.RandomCodeGenerator.IncludeLowercases, this.RandomCodeGenerator.IncludeUppercases, this.RandomCodeGenerator.Length, 0.7);
            let index = 0;
            items.forEach((x) => {
                for (let i = 0; i < x.Labels.length; i++) {
                    x.Labels[i].Value = l[index];
                    if (self.PresentationMode == "Triangle" || self.PresentationMode == "Tetrad") {
                        x.Labels[i].Value += "|" + l[index];
                    }
                    index++;
                }

                //index++;

            });
            return items;
        }

        public UpdateItemLabels(items: Models.ExperimentalDesignItem[]) {
            let self = this;

            // Nouveaux items
            let newItems: Models.ExperimentalDesignItem[] = [];

            items.forEach((item) => {
                let label = self.GetLabel(item.Code, 1);
                if (label == undefined) {
                    newItems.push(item);
                } else {
                    let existingItem = self.ListItems.filter((x) => { return x.Code == item.Code })[0];
                    existingItem.Labels.forEach((kvp) => {
                        ExperimentalDesign.SetLabel(self, item.Code, kvp.Key, Models.ExperimentalDesignItem.GetLabel(item, kvp.Key));
                    });


                }
            });

            

            newItems.forEach((x) => {
                self.ListItems.push(x);
            });

            // Item supprimés
            let oldItems: ExperimentalDesignItem[] = [];
            this.ListItems.forEach((x) => {
                let existing = items.filter((y) => { return y.Code == x.Code });
                if (existing.length == 0) {
                    oldItems.push(x);
                }
            });

            oldItems.forEach((x) => {
                Framework.Array.Remove(self.ListItems, x);
                let rows = self.ListExperimentalDesignRows.filter((y) => { return ExperimentalDesign.GetCode(y) == x.Code });
                rows.forEach((row) => {
                    Framework.Array.Remove(self.ListExperimentalDesignRows, row);
                });
            });


            if (newItems.length == 0) {
                return;
            }

            this.createListExperimentalDesignRows(this.Subjects, newItems);


        }

        public RemoveSubjects(subjects: string[]) {
            let self = this;
            // Suppression des lignes anciens sujets
            subjects.forEach((subject) => {
                let rows = self.ListExperimentalDesignRows.filter((x) => { return x.SubjectCode == subject });
                rows.forEach((row) => {
                    Framework.Array.Remove(self.ListExperimentalDesignRows, row);
                });
            });
        }

        private createListExperimentalDesignRows(subjects: string[], listItems: ExperimentalDesignItem[]) {
            let self = this;

            let createdRows = this.createRows(subjects);

            this.setOrder(this.Order, this.ListExperimentalDesignRows);

        }

        public AddSubjects(subjects: string[]) {
            this.createRows(subjects);
            this.subjects = this.subjects.concat(subjects);
        }

        private createRows(subjects: string[]): ExperimentalDesignRow[] {
            let self = this;

            if (subjects.length == 0) {
                return;
            }

            subjects.forEach((code) => {
                let subjectRows = self.ListExperimentalDesignRows.filter((x) => { return x.SubjectCode == code; })
                subjectRows.forEach((row) => {
                    Framework.Array.Remove(self.ListExperimentalDesignRows, row);
                });
            });

            let createdRows: ExperimentalDesignRow[] = [];

            let nbItems: number = 1;
            let orders: any = [
                [0]
            ]; // 1 seul ordre possible
            let indexLabels: any = [
                [0]
            ]; // Pas de 2e évaluation d'un même produit

            if (self.PresentationMode == "Pair") {
                nbItems = 2;
                orders = [
                    [0, 1], //"AB"
                    [1, 0]  //"BA"
                ];
                indexLabels = [
                    [0, 0], // Pas de 2e évaluation d'un même produit
                    [0, 0]  // Pas de 2e évaluation d'un même produit
                ];
            }

            if (self.PresentationMode == "Triangle") {
                nbItems = 2;
                orders = [
                    [0, 0, 1], //"AAB"
                    [0, 1, 0], //"ABA"
                    [1, 0, 0], //"BAA"
                    [1, 1, 0], //"BBA"
                    [1, 0, 1], //"BAB"
                    [0, 1, 1]  //"ABB"
                ];
                indexLabels = [
                    [0, 1, 0], // 2e évaluation de A en 2e position du triangle
                    [0, 0, 1], // 2e évaluation de A en 3e position du triangle
                    [0, 0, 1], // 2e évaluation de A en 3e position du triangle
                    [0, 1, 0], // 2e évaluation de B en 2e position du triangle
                    [0, 0, 1], // 2e évaluation de B en 3e position du triangle
                    [0, 0, 1]  // 2e évaluation de B en 3e position du triangle
                ];
            }

            if (self.PresentationMode == "Tetrad") {
                //AABB, BBAA, ABAB, BABA, ABBA, BAAB
                nbItems = 2;
                orders = [
                    [0, 0, 1, 1], //"AABB"
                    [1, 1, 0, 0], //"BBAA"
                    [0, 1, 0, 1], //"ABAB"
                    [1, 0, 1, 0], //"BABA"
                    [0, 1, 1, 0], //"ABBA"
                    [1, 0, 0, 1]  //"BAAB"
                ];
                indexLabels = [
                    [0, 1, 0, 1], // 2e évaluation de A en 2e position de la tétrade, 2e évaluation de B en 4e position de la tétrade
                    [0, 1, 0, 1], // 2e évaluation de B en 2e position de la tétrade, 2e évaluation de A en 4e position de la tétrade
                    [0, 0, 1, 1], // 2e évaluation de A en 3e position de la tétrade, 2e évaluation de B en 4e position de la tétrade
                    [0, 0, 1, 1], // 2e évaluation de B en 3e position de la tétrade, 2e évaluation de A en 4e position de la tétrade
                    [0, 0, 1, 1], // 2e évaluation de B en 3e position de la tétrade, 2e évaluation de A en 4e position de la tétrade
                    [0, 0, 1, 1]  // 2e évaluation de A en 3e position de la tétrade, 2e évaluation de B en 4e position de la tétrade
                ];
            }

            if (self.PresentationMode == "TwoOutOfFive") {
                nbItems = 2;
                orders = [
                    [1, 1, 0, 0, 0], //"AABBB"
                    [1, 0, 1, 0, 0], //"ABABB"
                    [1, 0, 0, 1, 0], //"ABBAB"
                    [0, 1, 0, 1, 0], //"BABAB"
                    [0, 0, 1, 1, 0], //"BBAAB"
                    [1, 0, 0, 0, 1], //"ABBBA"
                    [0, 1, 0, 0, 1], //"BABBA"
                    [0, 0, 1, 0, 1], //"BBABA"
                    [0, 0, 0, 1, 1], //"BBBAA"
                    [0, 1, 1, 0, 0], //"BBAAB"

                    [0, 0, 1, 1, 1], //"BBAAA"
                    [0, 1, 0, 1, 1], //"BABAA"
                    [0, 1, 1, 0, 1], //"BAABA"
                    [1, 0, 1, 0, 1], //"ABABA"
                    [1, 1, 0, 0, 1], //"AABBA"
                    [0, 1, 1, 1, 0], //"BAAAB"
                    [1, 0, 1, 1, 0], //"ABAAB"
                    [1, 1, 0, 1, 0], //"AABAB"
                    [1, 1, 1, 0, 0], //"AAABB"
                    [1, 0, 0, 1, 1], //"AABBA"
                ];
                indexLabels = [
                    [0, 1, 0, 1, 2],
                    [0, 0, 1, 1, 2],
                    [0, 0, 1, 1, 2],
                    [0, 0, 1, 1, 2],
                    [0, 1, 0, 1, 2],
                    [0, 0, 1, 2, 1],
                    [0, 0, 1, 2, 1],
                    [0, 1, 0, 2, 1],
                    [0, 1, 2, 0, 1],
                    [0, 0, 1, 1, 2],

                    [0, 1, 0, 1, 2],
                    [0, 0, 1, 1, 2],
                    [0, 0, 1, 1, 2],
                    [0, 0, 1, 1, 2],
                    [0, 1, 0, 1, 2],
                    [0, 0, 1, 2, 1],
                    [0, 0, 1, 2, 1],
                    [0, 1, 0, 2, 1],
                    [0, 1, 2, 0, 1],
                    [0, 0, 1, 1, 2]
                ];
            }

            let replicates = [];
            for (let i = 1; i <= this.NbReplicates; i++) {
                replicates.push(i);
            }
            let combinations = Framework.Maths.Combinations(self.ListItems.filter((x) => { return x.Code && x.Code.length > 0 }).map((x) => { return x.Code }), nbItems);

            if (combinations.length > 0) {

                replicates.forEach((replicate) => {
                    // Tous les juges voient toutes les combinaisons de 2 produits
                    // Pour chaque combinaison, chaque ordre de  est présenté le même nombre de fois au niveau du panel
                    let orderIndex = 0;
                    let rank = 1;
                    combinations.forEach((comb) => {
                        subjects.forEach((subject) => {

                            let order = orders[orderIndex];
                            let indexes = indexLabels[orderIndex];
                            let experimentalDesignRow = new Models.ExperimentalDesignRow();
                            experimentalDesignRow.SubjectCode = subject;
                            experimentalDesignRow.Replicate = replicate;
                            experimentalDesignRow.Rank = rank;

                            let codes = [];
                            let labels = [];
                            for (let i = 0; i < order.length; i++) {
                                let code = comb[order[i]];
                                let index = indexes[i];
                                codes.push(code);
                                let label: string = "";
                                let item = self.ListItems.filter((x) => { return x.Code == code })[0];
                                item.Labels.forEach((x) => {
                                    if (x.Key == replicate) {
                                        label = x.Value.split('|')[index];
                                    }
                                });

                                //     && x.Replicate == replicate
                                //})[0].Label.split('|')[index];
                                labels.push(label);
                            }
                            experimentalDesignRow.Code = codes.join('|');
                            experimentalDesignRow.Label = labels.join('|');

                            createdRows.push(experimentalDesignRow);
                            self.ListExperimentalDesignRows.push(experimentalDesignRow);

                            orderIndex++;
                            if (orderIndex >= orders.length) {
                                orderIndex = 0;
                            }
                        });
                        rank++;
                    });
                });
            }

            //this.Reset();

            return createdRows;
        }

        public static GetItems(design: ExperimentalDesign): any[] {
            //renvoie Rank | Code | Rep1 | Rep2 ...
            let res = [];

            design.ListItems.forEach((x) => {
                let code = x.Code;
                let rank = Framework.LocalizationManager.Get(design.Order);
                if (design.Order == "Fixed") {
                    if (x.DefaultRank == undefined) {
                        x.DefaultRank = 1;
                    }
                    rank = x.DefaultRank.toString();
                }

                if (res.filter((x) => { return x.Code == code }).length == 0) {
                    let newItem = [];
                    newItem["Code"] = code;
                    newItem["Rank"] = rank;
                    for (let i = 1; i <= design.NbReplicates; i++) {
                        let label = design.GetLabel(code, i);
                        if (label) {
                            newItem["Label" + i] = label;
                        } else {
                            newItem["Label" + i] = code;
                        }
                    }
                    res.push(newItem);
                }
            });

            return res;
        }

        public static ExperimentalDesignOrderEnum: string[] = ["Fixed", "Random", "WilliamsLatinSquare"];

        public static GetLabel(design: ExperimentalDesign, code: string): string {
            let res: string = "";
            if (design.Type == "Product") {
                let rows = design.ListExperimentalDesignRows.filter((x) => {
                    return (<ProductExperimentalDesignRow>x).ProductCode == code;
                });
                if (rows.length > 0) {
                    res = (<ProductExperimentalDesignRow>rows[0]).ProductLabel;
                }
            }
            if (design.Type == "Attribute") {
                let rows = design.ListExperimentalDesignRows.filter((x) => {
                    return (<AttributeExperimentalDesignRow>x).AttributeCode == code;
                });
                if (rows.length > 0) {
                    res = (<AttributeExperimentalDesignRow>rows[0]).AttributeLabel;
                }
            }
            if (design.Type == "TriangleTest") {
                let rows1 = design.ListExperimentalDesignRows.filter((x) => {
                    return (<TriangleTestExperimentalDesignRow>x).ProductCode1 == code;
                });
                if (rows1.length > 0) {
                    res = (<TriangleTestExperimentalDesignRow>rows1[0]).ProductLabel1;
                }
                let rows2 = design.ListExperimentalDesignRows.filter((x) => {
                    return (<TriangleTestExperimentalDesignRow>x).ProductCode2 == code;
                });
                if (rows2.length > 0) {
                    res = (<TriangleTestExperimentalDesignRow>rows2[0]).ProductLabel2;
                }
                let rows3 = design.ListExperimentalDesignRows.filter((x) => {
                    return (<TriangleTestExperimentalDesignRow>x).ProductCode3 == code;
                });
                if (rows3.length > 0) {
                    res = (<TriangleTestExperimentalDesignRow>rows3[0]).ProductLabel3;
                }
            }
            return res;
        }

        public static SetLabel(design: ExperimentalDesign, code: string, replicate: number, label: string) {

            design.SetLabel(code, replicate, label);

            let rows = design.ListExperimentalDesignRows.filter((x) => {
                return x.Code == code && x.Replicate == replicate;
            });
            rows.forEach((x) => {
                x.Label = label;
            });

            // MAJ ListExperimentalDesignRows
            //if (design.Type == "Product") {

            //    let rows = design.ListExperimentalDesignRows.filter((x) => {
            //        return (<ProductExperimentalDesignRow>x).ProductCode == code && x.Replicate == replicate;
            //    });
            //    rows.forEach((x) => {
            //        (<ProductExperimentalDesignRow>x).ProductLabel = label;
            //    });

            //}
            //if (design.Type == "Attribute") {
            //    let rows = design.ListExperimentalDesignRows.filter((x) => {
            //        return (<AttributeExperimentalDesignRow>x).AttributeCode == code && x.Replicate == replicate;
            //    });
            //    rows.forEach((x) => {
            //        (<AttributeExperimentalDesignRow>x).AttributeLabel = label;
            //    });
            //}
            //if (design.Type == "TriangleTest") {
            //TODO
            //let rows1 = design.ListExperimentalDesignRows.filter((x) => {
            //    return (<TriangleTestExperimentalDesignRow>x).ProductCode1 == code;
            //});
            //if (rows1.length > 0) {
            //    (<TriangleTestExperimentalDesignRow>rows1[0]).ProductLabel1 = label;
            //}
            //let rows2 = design.ListExperimentalDesignRows.filter((x) => {
            //    return (<TriangleTestExperimentalDesignRow>x).ProductCode2 == code;
            //});
            //if (rows2.length > 0) {
            //    res = (<TriangleTestExperimentalDesignRow>rows2[0]).ProductLabel2;
            //}
            //let rows3 = design.ListExperimentalDesignRows.filter((x) => {
            //    return (<TriangleTestExperimentalDesignRow>x).ProductCode3 == code;
            //});
            //if (rows3.length > 0) {
            //    res = (<TriangleTestExperimentalDesignRow>rows3[0]).ProductLabel3;
            //}
            //}

        }

        public static Create(edtype: string, id: number, subjects: string[], order: string, replicates: number, items: Models.ExperimentalDesignItem[], presentationMode: string = "Single"): ExperimentalDesign {
            let ed: ExperimentalDesign = new ExperimentalDesign();

            ed.Id = id;
            ed.Name = Framework.LocalizationManager.Format("NewExperimentalDesignOfType", [Framework.LocalizationManager.Get(edtype)]);
            ed.Type = edtype;

            ed.Order = order;
            ed.NbReplicates = replicates;

            ed.PresentationMode = presentationMode;

            //TOFIX : presentationmode -> utiliser additem ?

            ed.ListItems = items;
            ed.AddSubjects(subjects);

            ed.Reset();


            return ed;
        }

        public RemoveItems(codes: string[]) {
            let self = this;
            codes.forEach((x) => {
                let items = self.ListItems.filter((y) => { return y.Code == x });
                items.forEach((y) => {
                    Framework.Array.Remove(self.ListItems, y);
                    y.Labels.forEach((kvp) => {
                        let rows = self.ListExperimentalDesignRows.filter((z) => { return ExperimentalDesign.GetCode(z) == y.Code && z.Replicate == kvp.Key });
                        rows.forEach((row) => {
                            Framework.Array.Remove(self.ListExperimentalDesignRows, row);
                        });
                    });

                });
            });
            this.SetOrder(this.Order);
        }

        public AddItem(item: Models.ExperimentalDesignItem = undefined) {

            if (item == undefined) {
                item = this.GetNewItem([], this.ListItems.map((x) => { return x.Color; }));
            }

            if (item.Labels == undefined) {
                item.Labels = [];
            }

            let newItems = [];

            for (let i = 1; i <= this.NbReplicates; i++) {

                let label = "";

                if (this.Type == "Product") {
                    let nbItems = 1;
                    if (this.PresentationMode == "Triangle" || this.PresentationMode == "Tetrad") {
                        nbItems = 2;
                    }
                    if (this.PresentationMode == "TwoOutOfFive") {
                        nbItems = 3;
                    }

                    //TOCHECK : unique pour tetrade/triangle
                    let labels = Framework.Random.Helper.GetUniqueRandomCodes(this.GetLabels(), nbItems, this.RandomCodeGenerator.IncludeDigits, this.RandomCodeGenerator.IncludeLowercases, this.RandomCodeGenerator.IncludeUppercases, this.RandomCodeGenerator.Length, 0.7);
                    label = labels.join('|');
                    //label.Label = Framework.Random.GetUniqueRandomCodes(this.ListItemLabels.map((x) => { return x.Label; }), 1, this.RandomCodeGenerator.IncludeDigits, this.RandomCodeGenerator.IncludeLowercases, this.RandomCodeGenerator.IncludeUppercases, this.RandomCodeGenerator.Length, 0.7)[0];
                } else {
                    label = item.Code;
                }

                let kvp = new Framework.KeyValuePair(i, label);
                item.Labels.push(kvp);


            }

            this.ListItems.push(item);
            newItems.push(item);

            if (this.Subjects.length > 0) {
            }

            this.createListExperimentalDesignRows(this.Subjects, newItems);
        }

        public ConvertFromSL() {

            let self = this;

            if (self.Order == "LatinSquare") {
                self.Order = "WilliamsLatinSquare";
            }

            if (self.ListExperimentalDesignRows.length > 0) {

                if (self.ListExperimentalDesignRows[0]["ProductCode"]) {
                    self.ListExperimentalDesignRows.forEach((row) => {
                        row.Code = row["ProductCode"];
                        row.Label = row["ProductLabel"];
                    });
                }
                if (self.ListExperimentalDesignRows[0]["AttributeCode"]) {
                    self.ListExperimentalDesignRows.forEach((row) => {
                        row.Code = row["AttributeCode"];
                        row.Label = row["AttributeLabel"];
                    });
                }
                if (self.ListExperimentalDesignRows[0]["ProductCode1"]) {
                    self.ListExperimentalDesignRows.forEach((row) => {
                        row.Code = row["ProductCode1"] + "|" + row["ProductCode2"] + "|" + row["ProductCode3"];
                        row.Label = row["ProductLabel1"] + "|" + row["ProductLabel2"] + "|" + row["ProductLabel3"];
                    });
                }
            }
        }

        public GetNewItem(codes: string[] = [], colors: string[] = []): Models.ExperimentalDesignItem {

            //TODO : préfixer pour éviter 2 ExperimentalDesignItems avec même nom dans 2 plans de prés différents

            let item = new Models.ExperimentalDesignItem();
            let prefix = "";
            if (this.Type == "Product") {
                prefix = "P";
            }
            if (this.Type == "Attribute") {
                prefix = "A";
            }

            item.Code = Framework.Format.GetCode(this.ListItems.map((x) => { return x.Code }).concat(codes), prefix, 3);
            item.LongName = item.Code;
            item.Color = Framework.Color.GetColorFromContrastedPalette(colors);
            item.Labels = [];
            return item;

            //let prefix = this.Type.charAt(0);
            //if (this.Type == "Attribute") {
            //    prefix = this.Name + "_";
            //}
            //code = Framework.Format.GetCode(this.ListItems.map((x) => { return x.Code; }), prefix);
            //    //code = Framework.Random.GetUniqueRandomCodes(this.ListItemLabels.map((x) => { return x.Code; }), 1, false, false, true, 4, 0.7)[0];
        }

    }

    export class ExperimentalDesignRow {
        public SubjectCode: string;
        public Replicate: number;
        //public UploadId: number;
        public Rank: number;

        public Code: string = "";
        public Label: string = "";

    }

    // Conservé pour compatibilité
    export class ProductExperimentalDesignRow extends ExperimentalDesignRow {
        public ProductCode: string;
        public ProductLabel: string;
    }

    // Conservé pour compatibilité
    export class AttributeExperimentalDesignRow extends ExperimentalDesignRow {
        public AttributeCode: string;
        public AttributeLabel: string;
    }

    // Conservé pour compatibilité
    export class TriangleTestExperimentalDesignRow extends ExperimentalDesignRow {
        public Combination: string;
        public ProductCode1: string;
        public ProductCode2: string;
        public ProductCode3: string;
        public ProductLabel1: string;
        public ProductLabel2: string;
        public ProductLabel3: string;

        public static GetTriangle(row: TriangleTestExperimentalDesignRow) {
            return row.ProductCode1 + "|" + row.ProductCode2 + "|" + row.ProductCode3;
        }

        public static GetTriangleLabel(row: TriangleTestExperimentalDesignRow) {
            return row.ProductLabel1 + "|" + row.ProductLabel2 + "|" + row.ProductLabel3;
        }
    }

    export class CodeLabel {
        public Code: string;
        public Label: string;

        constructor(code: string, label: string) {
            this.Code = code;
            this.Label = label;
        }
    }

    export class TimerEvent {
        public Time: number;
        public Action: string;

        public static ActionEnum: string[] = ["visible", "hidden"];
    }

    //export class License {
    //    public ListAuthorizedMAC: string[];
    //    public Pseudo: string[];
    //    public CanAccessToSensoBase: boolean;
    //    public HasApprovedSensobaseConvention: boolean;
    //    public NbConcurrentAccess: number;
    //    public Login: string = '';
    //    public Id: string;
    //    public VATZone: string = '';
    //    public VATNumber: string = '';
    //    public ActualConnexions: number;
    //    public ActualUploads: number;
    //    public OnGoingUploads: number;
    //    public Password: string = '';
    //    public FirstName: string = '';
    //    public OrderFirstName: string = '';
    //    public LastName: string = '';
    //    public OrderLastName: string = '';
    //    public PhoneNumber: string = '';
    //    public OrderPhoneNumber: string = '';
    //    public Society: string = '';
    //    public OrderSociety: string = '';
    //    public ZipCode: string = '';
    //    public OrderZipCode: string = '';
    //    public Address: string = '';
    //    public OrderAddress: string = '';
    //    public City: string = '';
    //    public OrderCity: string = '';
    //    public Country: string = '';
    //    public OrderCountry: string = '';
    //    public Mail: string = '';
    //    public OrderMail: string = '';
    //    public NewLicenseType: string;
    //    public LastAccess: Date;
    //    public RegistrationDate: Date;
    //    public PurchaseDate: Date;
    //    public ExpirationDate: Date;
    //    public Validated: boolean;
    //    public TockenCount: number;
    //    public Consumptions: Array<Consumption>;
    //    //public Token: string;
    //    public PanelLeaderApplicationSettings: PanelLeaderApplicationSettings;

    //    public static LicenseEnum = {
    //        "0": "Undefined",
    //        "1": "Admin",
    //        "2": "FullPrice",
    //        "3": "LowPrice",
    //        "4": "Teaching",
    //        "5": "Free",
    //        "6": "TryOut"
    //    }

    //    constructor() {
    //        this.check();
    //    }

    //    public static FromJson(json: string): License {
    //        let license: Models.License = Framework.Factory.Create(Models.License, json);
    //        license.check();
    //        return license;
    //    }

    //    private check() {
    //        if (this.PanelLeaderApplicationSettings == undefined) {
    //            this.PanelLeaderApplicationSettings = new PanelLeaderApplicationSettings();
    //        }

    //        if (this.PanelLeaderApplicationSettings.DisplayName == undefined || this.PanelLeaderApplicationSettings.DisplayName == "") {
    //            this.PanelLeaderApplicationSettings.DisplayName = this.FirstName + " " + this.LastName;
    //        }
    //        if (this.PanelLeaderApplicationSettings.ReturnMailAddress == undefined || this.PanelLeaderApplicationSettings.ReturnMailAddress == "") {
    //            this.PanelLeaderApplicationSettings.ReturnMailAddress = this.Mail;
    //        }
    //        if (this.PanelLeaderApplicationSettings.Language == undefined || this.PanelLeaderApplicationSettings.Language == "") {
    //            this.PanelLeaderApplicationSettings.Language = Framework.LocalizationManager.GetDisplayLanguage();
    //        }
    //    }

    //    public static FromLocalStorage(): Models.License {
    //        let res = Framework.LocalStorage.GetFromLocalStorage("license");
    //        if (res) {
    //            return License.FromJson(res);
    //        }
    //        return undefined;
    //    }

    //    public SaveInLocalStorage() {

    //        let self = this;

    //        if (this == undefined) {
    //            Framework.LocalStorage.RemoveItem("license");
    //        }
    //        else {
    //            let jsonLicense = JSON.stringify(this);
    //            Framework.LocalStorage.SaveToLocalStorage("license", jsonLicense);
    //        }
    //    }

    //    public CheckForWarning() {
    //        let message: string = "";
    //        if (this.PanelLeaderApplicationSettings.LicenceWarningEnabled == null) {
    //            let dateDiff = Framework.DateDiff.ToDays(new Date(Date.now()), new Date(this.ExpirationDate.toString()));
    //            if (dateDiff < 10) {
    //                message += Framework.LocalizationManager.Format("WarningExpirationDateClose", [dateDiff.toString()]) + "\n";
    //            }
    //            if (this.TockenCount < 20) {
    //                message += Framework.LocalizationManager.Format("WarningTokenRemaining", [this.TockenCount.toString()]);
    //            }
    //        }
    //        return message;
    //    }
    //}

    export class PanelLeaderApplicationSettings {

        public LicenceWarningEnabled: boolean = true;
        public DatabaseSynchronization: boolean = true;
        public Autosave: boolean = true;
        public ConnectionToken: string = "";
        public Language: string = Framework.LocalizationManager.GetDisplayLanguage();
        public ReturnMailAddress: string = "";
        public DisplayName: string = "";

    }

    //export class Consumption {

    //    public Date: Date; //date à laquelle les données ont été enregistré sur le serveur
    //    public RegisterDate: Date;//date à laquelle on a enregistré la conso
    //    public NbTockens: number;
    //    public Action: string;
    //    public NbJudges: number;
    //    public Data: number;
    //    public SessionCode: string;
    //    public NumFacture: string;

    //    public static ActionTypeEnum = {
    //        "0": "Download",
    //        "1": "Purchase",
    //        "2": "Import",
    //        "3": "SMSSending",
    //        "4": "Subscription",
    //        "5": "Reset",
    //        "6": "AdminCreditDebit"
    //    }
    //}

    //export class Order {
    //    public License: License;
    //    public RedirectURL: string;
    //    public Status: string;
    //}

    export class Issue {
        public static CategUserEnum = { "0": "Admin", "1": "Developer", "2": "User", "3": "Guest" }
        public static TypeEnum = { "0": "Defect", "1": "Enhancement", "2": "Question", "3": "Cosmetic", "4": "Other" }
        public static TagEnum = { "0": "Security", "1": "Performance", "2": "Usability", "3": "Maintainability" }
        public static SeverityEnum = { "0": "Critical", "1": "High", "2": "Medium", "3": "Low" }
        public static StatusEnum = { "0": "New", "1": "Accepted", "2": "Started", "3": "Repaired" }
        public static ModuleEnum = { "0": "PanelLeader", "1": "Panelist", "2": "RLibrary", "3": "WebSite" }
        public static OSEnum = { "0": "Windows", "1": "MacOSX", "2": "Linux", "3": "Android", "4": "Other" }
        public static BrowserEnum = { "0": "InternetExplorer", "1": "Firefox", "2": "Opera", "3": "Chrome", "4:": "Safari", "5": "Other" }
        public Id: number;
        public OwnerPseudo: string;
        public Owner: string;
        public ListMails: Array<string>;
        public Reader: string;
        public OwnerCateg: string;
        public CreationDate: Date;
        public LastUpdateDate: Date;
        public Type: string = '';
        public ListTags: Array<string>;
        public Status: string = '0';
        public Severity: string = '';
        public Module: string = '';
        public AssignTo: string;
        public OS: string = '';
        public Browser: string = '';
        public IsVisibleToAllReaders: boolean;
        public Title: string = '';
        public TimeSensVersion: string;
        public Detail: string = '';
        public ListReplies: Array<Reply>;

    }

    export class Reply {
        public Date: Date;
        public Author: string;
        public AuthorCateg: string;
        public Content: string;
    }

    export class QuestionCondition {
        public Condition: string;
        public Value: string;
        public AnchorId: string;
    }

    export class ClientLog {
        public Date: Date;
        public DNS: string;
        public IP: string;
        public Location: string;
        public Client: string; // WebSite, Panelist, PanelLeader
        public Version: string;
        public Login: string;
        public OS: string;
        public Mobile: string;
        public Browser: string;
        public BrowserVersion: string;
        public ECMAScriptVersion: string;
        public UserAgent: string;
        public Language: string;
    }

    //export class WebsiteOrder {
    //    public LicenseType: string;
    //    public Subscription: string = "NoSubscription";
    //    public TokenPack: string = "NoToken";
    //    public OrderMode: string;
    //    public SubscriptionTotal: number = 0;
    //    public TokensTotal: number
    //    public ExpirationDate: Date;
    //    public FromDate: Date;
    //    public ToDate: Date;
    //    public VATZone: string = '';
    //    public VATNumber: string = '';
    //    public OrderFirstName: string = '';
    //    public OrderLastName: string = '';
    //    public OrderPhone: string = '';
    //    public OrderSociety: string = '';
    //    public OrderZipCode: string = '';
    //    public OrderAddress: string = '';
    //    public OrderCity: string = '';
    //    public OrderCountry: string = '';
    //    public OrderMail: string = '';
    //}




}


