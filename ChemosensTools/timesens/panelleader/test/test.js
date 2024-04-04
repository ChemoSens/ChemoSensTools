//window.onload = () => {
//    Framework.LoadFramework('http://localhost:56206', (compatibility) => {
//        //PanelLeaderModelTest.Start();
//        PanelLeaderTest.Start();
//    });
//}
//module PanelLeaderModelTest {
//    export function GetData1(): Models.Data[] {
//        return [
//            Models.Data.Create("Profile", "S001", "P001", "A001", 1, 1),
//            Models.Data.Create("Profile", "S001", "P001", "A001", 1, 2),
//            Models.Data.Create("Profile", "S001", "P001", "A001", 2, 1),
//            Models.Data.Create("Profile", "S001", "P001", "A001", 2, 2),
//            Models.Data.Create("Profile", "S002", "P001", "A001", 1, 1),
//            Models.Data.Create("Profile", "S001", "P002", "A001", 1, 1),
//            Models.Data.Create("Profile", "S001", "P001", "A002", 1, 1)
//        ]
//    };
//    export function Start() {
//        QUnit.module("PanelLeaderModels", function (context) {
//            QUnit.module("Session", function (test) {
//                //QUnit.test("constructor", function (assert) {
//                //    let session = new PanelLeaderModels.Session();
//                //    assert.ok("a" == "a", "TODO")
//                //})
//                QUnit.test("FromData", function (assert) {
//                    let session = PanelLeaderModels.Session.FromData(GetData1());
//                    assert.ok(session.ListSubjects.length == 2, "Creation juges OK");
//                    let productDesign = session.ListExperimentalDesigns.filter((x) => { return x.Type == "Product" })[0];
//                    assert.ok(productDesign.NbReplicates == 2 && productDesign.NbIntakes == 2 && productDesign.NbItems == 2, "Creation plan pres produits OK");
//                    let attributeDesign = session.ListExperimentalDesigns.filter((x) => { return x.Type == "Attribute" })[0];
//                    assert.ok(attributeDesign.NbReplicates == 1 && attributeDesign.NbItems == 2, "Creation plan pres descripteurs OK");
//                    assert.ok(session.ListData.length == 7, "Creation data OK");
//                })
//                QUnit.test("SetMailFromTemplate", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("GetSessionInfo", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("Close", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("LogAction", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("FromJSON", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("ToggleLock", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("Check", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("GetUniqueControlFriendlyName", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("FromFile", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("FromTemplate", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("GetNewScreen", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("AddScreen", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("DeleteScreen", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("MoveScreen", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("ChangeScreenResolution", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("AddItemsToDesign", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("EditDesignRanks", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("ResetDesign", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("UpdateDesignLabels", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("RemoveItemsFromDesign", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("UpdateItemLabel", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("SetSubjectsPasswords", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("SetMonitoringProgress", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("UpdateMonitoringProgress", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("ListDataContainsProductCode", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("ListDataContainsAttributeCode", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("ListDataContainsSubjectCode", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("RemoveDesign", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("CheckIfDesignIsUsedByControl", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("GetDesignData", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("UpdateDesign", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("RemoveSubjects", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("RemoveData", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("GetNewData", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("GetNewItems", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("GetUniqueCode", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("AddNewPanelist", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("GetNewPanelists", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("UpdateSubjectCodes", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("GetDesignFromInlineDesign", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("AddNewPanelists", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("GetNewDesign", function (assert) {
//                    let session = new PanelLeaderModels.Session();
//                    let productDesign = session.GetNewDesign("Product", "Fixed", 2, [], "Product design");
//                    assert.ok(productDesign.Id == 1 && productDesign.Name == "Product design" && productDesign.Type == "Product" && productDesign.Order == "Fixed" && productDesign.NbReplicates == 2 && productDesign.ListItems.length == 0 && productDesign.ListExperimentalDesignRows.length == 0, "Product design 1 OK");
//                    session.AddNewDesign(productDesign);
//                    let productDesign2 = session.GetNewDesign("Product", "Random", 1, [], "Product design");
//                    assert.ok(productDesign2.Id == 2 && productDesign2.Name == "Product design (1)" && productDesign2.Type == "Product" && productDesign2.Order == "Random" && productDesign2.NbReplicates == 1 && productDesign2.ListItems.length == 0 && productDesign2.ListExperimentalDesignRows.length == 0, "Product design 2 OK");
//                    session.AddNewDesign(productDesign2);
//                })
//                QUnit.test("AddNewDesign", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("ApplyStyle", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("SetListScreensBackground", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("SetListScreensProgressBar", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("SaveAsUndeployedCopy", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("AddControlToScreen", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("RemoveControlFromScreen", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("UpdateControlName", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("GetNewDataTab", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("AddDataTab", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("RemoveDataTab", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("MoveSelectionToAnotherTab", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("TransformSessionsInReplicates", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("TransformReplicatesInIntakes", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("TransformScoresInMeans", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("TransformScores", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("TransformScoresInRanks", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("SearchAndReplaceData", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("ModifySelectionInData", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("AddData", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("GetDefaultExperimentalDesign", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("GetSubjectFromCode", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("GetMemo", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("SetDataTabs", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("UpdatePanelistMail", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("GetMailContent", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("RemoveUpload", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("SetUpload", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("ToggleScreenCondition", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("SetScreenBackground", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//                QUnit.test("SetScreenExperimentalDesign", function (assert) {
//                    assert.ok("a" == "a", "TODO")
//                })
//            })
//        })
//    }
//}
//module PanelLeaderTest {
//    //export function LoginThenReadSessionFromJSON(fileName: string) {
//    //    let self = this;
//    //    return new Promise(function (resolve: (res: { app: PanelLeader.App, session: PanelLeaderModels.Session }) => void, reject) {
//    //        let app = new PanelLeader.App(true);
//    //        app.OnLogin = () => {
//    //            $.ajax({
//    //                url: fileName,
//    //                async: false,
//    //                dataType: 'text',
//    //                success: function (result) {
//    //                    let session = PanelLeaderModels.Session.FromJSON(result.toString());
//    //                    app.SetNewSession(session, false);
//    //                    resolve({ app: app, session: session });
//    //                },
//    //                error: function (error) {
//    //                    let e = error;
//    //                }
//    //            });
//    //        }
//    //    });
//    //}
//    export function Start() {
//        QUnit.module("PanelLeader", function (context) {
//            context.before(function (assert) {
//                return new Promise(function (resolve, reject) {
//                    Framework.Test.LoadPage('../index.html', () => {
//                        resolve();
//                    });
//                });
//            });
//            QUnit.module("No session", function (context) {
//                context.beforeEach(function (assert) {
//                    var done = assert.async();
//                    // TODO : améliorer
//                    let license = new Models.License();
//                    license.Login = "mvisalli";
//                    license.Password = "CHUch0tR";
//                    license.SaveInLocalStorage();
//                    let app = new PanelLeader.App(true);
//                    app.OnLogin = () => {
//                        this.app = app;                        
//                        done();
//                    }
//                });
//                QUnit.module("MenuViewModel", function (context) {
//                    QUnit.test("constructor", function (assert) {
//                        assert.expect(7);
//                        var done = assert.async();
//                        let vm = <PanelLeader.ViewModels.MenuViewModel>this.app.Menu;
//                        assert.ok(vm != undefined, "MenuViewModel chargé.");
//                        assert.ok(vm.HasSessionDefined == false, "HasSessionDefined OK.");
//                        assert.ok(vm.IsUploaded == false, "IsUploaded OK.");
//                        assert.ok(vm.HasData == false, "HasData OK.");
//                        assert.ok(vm.CanUndo == false, "CanUndo OK.");
//                        assert.ok(vm.CanRedo == false, "CanRedo OK.");
//                        assert.ok(vm.CanSave == false, "CanSave OK.");
//                        //TODO Undo: () => void;
//                        //TODO Redo: () => void;
//                        //TODO ShowWarnings: () => void;
//                        //TODO ShowModalNewSessionFromXML: () => void;
//                        //TODO ShowModalNewSessionFromDelimitedTextFile: () => void;
//                        //TODO ExportSessionAsXML: () => void;
//                        //TODO ShowModalSessionsDB: () => void;
//                        //TODO SaveSessionInLocalDB: () => void;
//                        //TODO ShowModalSaveAsUndeployedCopy: () => void;
//                        //TODO Exit: () => void;
//                        //TODO ShowModalHelp: () => void;
//                        //TODO ToggleLock: () => void;
//                        //TODO ShowModalBugReport: () => void;
//                        //TODO ShowViewAttributes: () => void;
//                        //TODO Save: () => void;
//                        done();
//                    });
//                });
//                QUnit.module("ModalSettingsViewModel", function (context) {
//                    context.beforeEach(function (assert) {
//                        var done = assert.async();
//                        this.app.OnModalSettingsViewModelLoaded = ((vm: PanelLeader.ViewModels.ModalSettingsViewModel) => {
//                            this.vm = vm;
//                            done();
//                        });
//                        this.app.Menu.ShowModalSettings();
//                    });
//                    context.afterEach(function (assert) {
//                        this.vm.Close();
//                    });
//                    QUnit.test("constructor", function (assert) {
//                        assert.expect(15);
//                        var done = assert.async();
//                        let vm = <PanelLeader.ViewModels.ModalSettingsViewModel>this.vm;
//                        assert.ok(vm != undefined, "ModalSettingsViewModel chargé.");
//                        assert.ok(vm.SelectLanguage.Value == vm.ApplicationSettings.Language, "SelectLanguage OK.");
//                        assert.ok(vm.InputMailAddress.Value == vm.ApplicationSettings.ReturnMailAddress, "InputMailAddress OK.");
//                        assert.ok(vm.InputDisplayName.Value == vm.ApplicationSettings.DisplayName, "InputDisplayName OK.");
//                        //assert.ok(vm.SelectDatabaseSynchronization.Value == vm.ApplicationSettings.DatabaseSynchronization.toString(), "SelectDatabaseSynchronization OK.");
//                        assert.ok(vm.SelectAutosave.Value == vm.ApplicationSettings.Autosave.toString(), "SelectAutosave OK.");
//                        assert.ok(vm.SpanVersion.Text == vm.Version, "SpanVersion OK.");
//                        vm.InputMailAddress.Set("");
//                        assert.ok(vm.InputMailAddress.IsValid == false && (<PanelLeader.App>this.app).License.PanelLeaderApplicationSettings.ReturnMailAddress == vm.ApplicationSettings.ReturnMailAddress, "InputMailAddress invalid OK.");
//                        assert.ok(vm.BtnSave.IsEnabled == false, "BtnSave disabled OK.");
//                        vm.InputMailAddress.Set("test@test.fr");
//                        assert.ok(vm.InputMailAddress.IsValid == true, "InputMailAddress valid OK.");
//                        assert.ok(vm.BtnSave.IsEnabled == true, "BtnSave enabled OK.");
//                        vm.InputDisplayName.Set("");
//                        assert.ok(vm.InputDisplayName.IsValid == false && (<PanelLeader.App>this.app).License.PanelLeaderApplicationSettings.DisplayName == vm.ApplicationSettings.DisplayName, "InputDisplayName invalid OK.");
//                        assert.ok(vm.BtnSave.IsEnabled == false, "BtnSave disabled OK.");
//                        vm.InputDisplayName.Set("test");
//                        assert.ok(vm.InputDisplayName.IsValid == true, "InputDisplayName valid OK.");
//                        assert.ok(vm.BtnSave.IsEnabled == true, "BtnSave enabled OK.");
//                        vm.SaveLicense(vm.ApplicationSettingsCopy);
//                        assert.ok((<PanelLeader.App>this.app).License.PanelLeaderApplicationSettings.ReturnMailAddress == "test@test.fr" && (<PanelLeader.App>this.app).License.PanelLeaderApplicationSettings.DisplayName == "test", "SaveLicense OK.");
//                        done();
//                    });
//                });
//                QUnit.module("ModalLoginViewModel", function (context) {
//                    QUnit.only("constructor", function (assert) {
//                        assert.expect(9);
//                        var done = assert.async();
//                        let app = <PanelLeader.App>this.app;
//                        app.OnModalLoginViewModelLoaded = ((vm: PanelLeader.ViewModels.ModalLoginViewModel) => {                            
//                            assert.ok(app.License == undefined, "LogOut OK.");
//                            assert.ok(vm != undefined, "ModalLoginViewModel chargé.");
//                            assert.ok(vm.InputLoginId.Value == "", "InputLoginId OK.");
//                            assert.ok(vm.InputLoginPassword.Value == "", "InputLoginPassword OK.");
//                            assert.ok(vm.DivLoginError.IsVisible == false, "DivLoginError OK.");
//                            assert.ok(vm.BtnLogin.IsEnabled == false, "BtnLogin OK.");
//                            vm.InputLoginId.Set("wrongLogin");
//                            vm.InputLoginPassword.Set("wrongPassword");
//                            assert.ok(vm.BtnLogin.IsEnabled == true, "BtnLogin OK.");
//                            vm.BtnLogin.Click();
//                            assert.ok(app.License == undefined, "Login KO.");
//                            vm.InputLoginId.Set("mvisalli");
//                            vm.InputLoginPassword.Set("CHUch0tR");
//                            //TODO ICI
//                            assert.ok(app.License == undefined, "Login OK.");
//                            vm.Close();
//                            done();
//                        });
//                        app.Menu.LogOut();
//                    });
//                });
//            });
//            QUnit.module("Empty session", function (context) {
//                context.beforeEach(function (assert) {
//                    var done = assert.async();
//                    let app = new PanelLeader.App(true);
//                    app.OnLogin = () => {
//                        let template = PanelLeaderModels.TemplatedSession.GetEmptyTemplatedSession();
//                        let session = PanelLeaderModels.Session.FromTemplate(template);
//                        app.SetNewSession(session, false);                        
//                        this.app = app;
//                        this.session = session;
//                        done();
//                    }
//                });
//                //ModalImportViewModel<T>
//                //ModalProtocolDBFieldsViewModel
//                //ModalSubjectsDBViewModel
//                //ModalExperimentalDesignItemDBViewModel
//                //ModalMailViewModel
//                //ModalSaveSessionAsUndeployedCopyViewModel
//                //ModalSessionsDBViewModel              
//                //ModalDesignSettingsViewModel
//                //ModalTokenDownloadConfirmationViewModel
//                //ModalScreenStyleViewModel
//                //ModalScreenFromXMLViewModel
//                //ModalScreenPropertiesViewModel
//                //ModalResetProgressViewModel                
//                //ModalPivotViewModel
//                //ModalSaveAnalysisAsTemplateViewModel
//                //ModalAnalysisViewModel
//                //ModalSaveMailAsTemplateViewModel
//                //ModalEditDesignRanksViewModel
//                QUnit.module("MenuViewModel", function (context) {
//                    QUnit.test("constructor", function (assert) {
//                        assert.expect(4);
//                        var done = assert.async();
//                        let vm = <PanelLeader.ViewModels.MenuViewModel>this.app.Menu;
//                        assert.ok(vm != undefined, "MenuViewModel chargé.");
//                        assert.ok(vm.HasSessionDefined == true, "HasSessionDefined OK.");
//                        assert.ok(vm.IsUploaded == false, "IsUploaded OK.");
//                        assert.ok(vm.HasData == false, "HasData OK.");
//                        //TODO Undo: () => void;
//                        //TODO Redo: () => void;
//                        //TODO ShowWarnings: () => void;
//                        //TODO ShowModalNewSessionFromXML: () => void;
//                        //TODO ShowModalNewSessionFromDelimitedTextFile: () => void;
//                        //TODO ExportSessionAsXML: () => void;
//                        //TODO ShowModalSessionsDB: () => void;
//                        //TODO SaveSessionInLocalDB: () => void;
//                        //TODO ShowModalSessionLog: () => void;
//                        //TODO ShowModalSaveAsUndeployedCopy: () => void;
//                        //TODO Exit: () => void;
//                        //TODO ShowModalHelp: () => void;
//                        //TODO LogOut: () => void;
//                        //TODO ToggleLock: () => void;
//                        //TODO ShowModalBugReport: () => void;
//                        //TODO ShowViewAttributes: () => void;
//                        //TODO Save: () => void;
//                        //TODO HasSessionDefined() { return this.hasSessionDefined }
//                        //TODO CanUndo() { return this.canUndo }
//                        //TODO CanRedo() { return this.canRedo }
//                        //TODO IsUploaded() { return this.isUploaded }
//                        //TODO HasData() { return this.hasData }
//                        done();
//                    });
//                });
//                QUnit.module("ModalSessionLogViewModel", function (context) {
//                    context.beforeEach(function (assert) {
//                        var done = assert.async();
//                        (<PanelLeader.App>this.app).OnModalSessionLogViewModelLoaded = ((vm: PanelLeader.ViewModels.ModalSessionLogViewModel) => {
//                            this.vm = vm;
//                            done();
//                        });
//                        (<PanelLeader.App>this.app).Menu.ShowModalSessionLog();
//                    });
//                    context.afterEach(function (assert) {
//                        this.vm.Close();
//                    });
//                    //QUnit.only("constructor", function (assert) {
//                    //    assert.expect(1);
//                    //    var done = assert.async();
//                    //    let vm = <PanelLeader.ViewModels.ModalSessionLogViewModel>this.vm;
//                    //    assert.ok(vm != undefined, "ModalSessionLogViewModel chargé.");
//                    //    //            public get LabelSize() { return this.labelSize }
//                    //    //public get LabelDescription() { return this.labelDescription }
//                    //    //public get LabelDataBasePath() { return this.labelDataBasePath }
//                    //    //public get LabelLastSave() { return this.labelLastSave }
//                    //    //public get LabelLastSynchronisation() { return this.labelLastSynchronisation }
//                    //    //public get LabelActions() { return this.labelActions }
//                    //    done();
//                    //});
//                });
//                QUnit.module("ModalSessionWizardViewModel", function (context) {
//                    context.beforeEach(function (assert) {
//                        var done = assert.async();
//                        this.app.OnModalSessionWizardViewModelLoaded = ((vm: PanelLeader.ViewModels.ModalSessionWizardViewModel) => {
//                            this.vm = vm;
//                            done();
//                        });
//                        this.app.Menu.ShowModalSessionWizard();
//                    });
//                    context.afterEach(function (assert) {
//                        this.vm.Close();
//                    });
//                    QUnit.test("constructor", function (assert) {
//                        assert.expect(1);
//                        var done = assert.async();
//                        let vm = <PanelLeader.ViewModels.ModalSessionWizardViewModel>this.vm;
//                        assert.ok(vm != undefined, "ModalSessionWizardViewModel chargé.");
//                        done();
//                    });
//                });
//                QUnit.module("SubjectsViewModel", function (context) {
//                    context.beforeEach(function (assert) {
//                        var done = assert.async();
//                        this.app.OnSubjectsViewModelLoaded = ((vm: PanelLeader.ViewModels.SubjectsViewModel) => {
//                            this.vm = vm;
//                            done();
//                        });
//                    });
//                    QUnit.test("SubjectsViewModel", function (assert) {
//                        assert.expect(6);
//                        var done = assert.async();
//                        let session = <PanelLeaderModels.Session>this.session;
//                        let app = <PanelLeader.App>this.app;
//                        let vm = <PanelLeader.ViewModels.SubjectsViewModel>this.vm;
//                        assert.ok(vm != undefined && app.IsSaved == true, "SubjectsViewModel chargé.");
//                        vm.AddNewPanelists(1);
//                        let s001 = session.GetSubjectFromCode("S001");
//                        assert.ok(session.ListSubjects.length == 1 && s001 != undefined && app.IsSaved == false, "AddNewPanelists(1) OK");
//                        vm.AddNewPanelists(2);
//                        let s002 = session.GetSubjectFromCode("S002")
//                        let s003 = session.GetSubjectFromCode("S003");
//                        assert.ok(session.ListSubjects.length == 3 && s002 != undefined && s003 != undefined && app.IsSaved == false, "AddNewPanelists(2) OK");
//                        // TODO : test experimental designs OK, log OK                        
//                        vm.RemovePanelists([s001, s003], false);
//                        assert.ok(session.ListSubjects.length == 1 && session.GetSubjectFromCode("S001") == undefined && session.GetSubjectFromCode("S003") == undefined && app.IsSaved == false, "RemovePanelists OK");
//                        // TODO : test experimental designs OK, log OK, suppression data OK       
//                        let originalPassword = s002.Password;
//                        vm.SetPanelistsPasswords([s002]);
//                        let firstPassword = s002.Password;
//                        vm.SetPanelistsPasswords([s002]);
//                        let secondPassword = s002.Password;
//                        assert.ok(originalPassword == "" && firstPassword.length == session.SubjectPasswordGenerator.Length && secondPassword.length == session.SubjectPasswordGenerator.Length && secondPassword != firstPassword, "SetPanelistsPasswords OK");
//                        // TODO + suppression de la db
//                        //vm.ExportPanelistToLocalDB([s002]);
//                        //assert.ok(app.DbSubject.Exists(s002).then();
//                        //TODO
//                        //vm.EditCustomFields()
//                        //TODO : true
//                        assert.ok(vm.ListDataContainsSubjectCode([s002.Code]) == false, "ListDataContainsSubjectCode OK");
//                        done();
//                    });
//                    QUnit.test("SubjectsViewModel > ModalImportViewModel<Subject>", function (assert) {
//                        assert.expect(1);
//                        var done = assert.async();
//                        let session = <PanelLeaderModels.Session>this.session;
//                        let app = <PanelLeader.App>this.app;
//                        let vm = <PanelLeader.ViewModels.SubjectsViewModel>this.vm;
//                        app.OnModalImportViewModelLoaded = (subjectVm: PanelLeader.ViewModels.ModalImportViewModel<Models.Subject>) => {
//                            assert.ok(subjectVm != undefined, "ModalImportViewModel chargé");
//                            subjectVm.Close();
//                            //TODO
//                            done();
//                        };
//                        let modal = vm.ShowModalImportPanelists();
//                        modal.Confirm();
//                    });
//                });
//                QUnit.module("ExperimentalDesignItemsViewModel (products)", function (context) {
//                    context.beforeEach(function (assert) {
//                        var done = assert.async();
//                        this.app.OnExperimentalDesignViewModelLoaded = ((vm: PanelLeader.ViewModels.ExperimentalDesignItemsViewModel) => {
//                            this.vm = vm;
//                            done();
//                        });
//                        this.app.Menu.ShowViewProducts();
//                    });
//                    QUnit.test("constructor", function (assert) {
//                        assert.expect(1);
//                        var done = assert.async();
//                        let session = <PanelLeaderModels.Session>this.session;
//                        let vm = <PanelLeader.ViewModels.ExperimentalDesignItemsViewModel>this.vm;
//                        assert.ok(vm != undefined, "ExperimentalDesignItemsViewModel chargé.");
//                        //let productDesign = vm.AddNewDesign("Product");
//                        //assert.ok(productDesign.Id = 1);
//                        //assert.ok(session.ListExperimentalDesigns.length == 1);
//                        done();
//                    });
//                });
//                QUnit.module("ScenarioViewModel", function (context) {
//                    context.beforeEach(function (assert) {
//                        var done = assert.async();
//                        this.app.OnScenarioViewModelLoaded = ((vm: PanelLeader.ViewModels.ScenarioViewModel) => {
//                            this.vm = vm;
//                            done();
//                        });
//                        this.app.Menu.ShowViewScenario();
//                    });
//                    QUnit.test("constructor", function (assert) {
//                        assert.expect(6);
//                        var done = assert.async();
//                        let session = <PanelLeaderModels.Session>this.session;
//                        let vm = <PanelLeader.ViewModels.ScenarioViewModel>this.vm;
//                        assert.ok(vm != undefined, "ScenarioViewModel chargé.");
//                        let firstScreen = vm.InsertScreen(undefined, 0, 0);
//                        let secondScreen = vm.InsertScreen(undefined, 1, 0);
//                        assert.ok(firstScreen.Id == 1 && firstScreen.ExperimentalDesignId == 0 && secondScreen.Id == 2 && secondScreen.ExperimentalDesignId == 0 && session.ListScreens.length == 2, "InsertScreen OK");
//                        //vm.MoveScreen(0, "bottom");
//                        //TODO : insert screen avec design, issaved
//                        vm.DeleteScreen(secondScreen, 1);
//                        assert.ok(session.ListScreens.length == 1, "DeleteScreen OK");
//                        let firstScreenControl1 = ScreenReader.Controls.TextArea.Create("");
//                        vm.AddControlToScreen(firstScreen, firstScreenControl1, () => { }, true);
//                        assert.ok(firstScreen.Controls.length == 1, "AddControlToScreen OK");
//                        //vm.OnControlPropertyChanged(firstScreenControl1, "_Height", 200, 300);
//                        //assert.ok(firstScreenControl1._Height == 300, "OnControlPropertyChanged OK");
//                        let controlNames = vm.GetListSortingControlNames();
//                        assert.ok(controlNames.length == 0, "GetListControlNames OK"); //TODO : avec sorting
//                        vm.RemoveControlFromScreen(firstScreen, firstScreenControl1);
//                        assert.ok(firstScreen.Controls.length == 0, "RemoveControlFromScreen OK");
//                        done();
//                    });
//                    QUnit.module("ModalSessionsDBViewModel", function (context) {
//                        context.beforeEach(function (assert) {
//                            var done = assert.async();
//                            this.app.OnModalSessionsDBViewModelLoaded = (vm: PanelLeader.ViewModels.ModalSessionsDBViewModel) => {
//                                this.vm = vm;
//                                done();
//                            };
//                            this.vm.ShowModalScreenFromXML(0, 0, () => { });
//                        });
//                        QUnit.test("constructor", function (assert) {
//                            assert.expect(1);
//                            var done = assert.async();
//                            let vm = <PanelLeader.ViewModels.ModalSessionsDBViewModel>this.vm;
//                            assert.ok(vm != undefined, "ModalSessionsDBViewModel chargé.");
//                            done();
//                        });
//                        context.afterEach(function (assert) {
//                            this.vm.Close();
//                        });
//                    });
//                    QUnit.module("ModalScreenPropertiesViewModel", function (context) {
//                        context.beforeEach(function (assert) {
//                            var done = assert.async();
//                            let firstScreen = this.vm.InsertScreen(undefined, 0, 0);
//                            this.app.OnModalScreenPropertiesViewModelLoaded = (vm: PanelLeader.ViewModels.ModalScreenPropertiesViewModel) => {
//                                this.vm = vm;
//                                done();
//                            };
//                            this.vm.ShowModalScreenProperties(firstScreen, 0, () => { });
//                        });
//                        QUnit.test("constructor", function (assert) {
//                            assert.expect(1);
//                            var done = assert.async();
//                            let vm = <PanelLeader.ViewModels.ModalScreenPropertiesViewModel>this.vm;
//                            assert.ok(vm != undefined, "ModalScreenPropertiesViewModel chargé.");
//                            done();
//                        });
//                        context.afterEach(function (assert) {
//                            this.vm.Close();
//                        });
//                    });
//                    QUnit.module("ModalSimulationViewModel", function (context) {
//                        context.beforeEach(function (assert) {
//                            var done = assert.async();
//                            this.app.OnModalSimulationViewModelLoaded = (vm: PanelLeader.ViewModels.ModalSimulationViewModel) => {
//                                this.vm = vm;
//                                done();
//                            };
//                            this.vm.ShowModalSimulation(new Models.SubjectSeance());
//                        });
//                        QUnit.test("constructor", function (assert) {
//                            assert.expect(1);
//                            var done = assert.async();
//                            let vm = <PanelLeader.ViewModels.ModalSimulationViewModel>this.vm;
//                            assert.ok(vm != undefined, "ModalSimulationViewModel chargé.");
//                            done();
//                        });
//                        context.afterEach(function (assert) {
//                            this.vm.Close();
//                        });
//                    });
//                });
//                QUnit.module("UploadViewModel", function (context) {
//                    context.beforeEach(function (assert) {
//                        var done = assert.async();
//                        this.app.OnUploadViewModelLoaded = ((vm: PanelLeader.ViewModels.UploadViewModel) => {
//                            this.vm = vm;
//                            done();
//                        });
//                        this.app.Menu.ShowViewUpload();
//                    });
//                    QUnit.test("constructor", function (assert) {
//                        assert.expect(1);
//                        var done = assert.async();
//                        let vm = <PanelLeader.ViewModels.UploadViewModel>this.vm;
//                        assert.ok(vm != undefined, "UploadViewModel chargé.");
//                        done();
//                    });
//                });
//                QUnit.module("MonitoringViewModel", function (context) {
//                    context.beforeEach(function (assert) {
//                        var done = assert.async();
//                        this.app.OnMonitoringViewModelLoaded = ((vm: PanelLeader.ViewModels.MonitoringViewModel) => {
//                            this.vm = vm;
//                            done();
//                        });
//                        this.app.Menu.ShowViewMonitoring();
//                    });
//                    QUnit.test("constructor", function (assert) {
//                        assert.expect(1);
//                        var done = assert.async();
//                        let vm = <PanelLeader.ViewModels.MonitoringViewModel>this.vm;
//                        assert.ok(vm != undefined, "MonitoringViewModel chargé.");
//                        done();
//                    });
//                });
//                QUnit.module("DataViewModel", function (context) {
//                    context.beforeEach(function (assert) {
//                        var done = assert.async();
//                        this.app.OnDataViewModelLoaded = ((vm: PanelLeader.ViewModels.DataViewModel) => {
//                            this.vm = vm;
//                            done();
//                        });
//                        this.app.Menu.ShowViewData();
//                    });
//                    QUnit.test("constructor", function (assert) {
//                        assert.expect(1);
//                        var done = assert.async();
//                        let vm = <PanelLeader.ViewModels.DataViewModel>this.vm;
//                        assert.ok(vm != undefined, "DataViewModel chargé.");
//                        done();
//                    });
//                });
//            });
//            QUnit.module("Hedonic test templated session", function (context) {
//                context.beforeEach(function (assert) {
//                    var done = assert.async();
//                    let app = new PanelLeader.App(true);
//                    app.OnLogin = () => {
//                        let template = PanelLeaderModels.TemplatedSession.GetHedonicTestTemplatedSession(3, 1);
//                        template.NbSubjects = 10;
//                        let session = PanelLeaderModels.Session.FromTemplate(template);
//                        app.SetNewSession(session, false);
//                        this.app = app;
//                        this.session = session;
//                        done();
//                    }
//                });
//                QUnit.module("ScenarioViewModel", function (context) {
//                    context.beforeEach(function (assert) {
//                        var done = assert.async();
//                        this.app.OnScenarioViewModelLoaded = ((vm: PanelLeader.ViewModels.ScenarioViewModel) => {
//                            this.vm = vm;
//                            done();
//                        });
//                        this.app.Menu.ShowViewScenario();
//                    });
//                    QUnit.test("constructor", function (assert) {
//                        assert.expect(2);
//                        var done = assert.async();
//                        let session = <PanelLeaderModels.Session>this.session;
//                        let vm = <PanelLeader.ViewModels.ScenarioViewModel>this.vm;
//                        assert.ok(vm != undefined, "ScenarioViewModel chargé.");
//                        assert.ok(session.ListScreens.length == 5, "Ecrans chargés.");
//                        done();
//                    });
//                    QUnit.module("ModalSimulationViewModel", function (context) {
//                        context.beforeEach(function (assert) {
//                            var done = assert.async();
//                            this.app.OnModalSimulationViewModelLoaded = (vm: PanelLeader.ViewModels.ModalSimulationViewModel) => {
//                                this.vm = vm;
//                                done();
//                            };
//                            this.vm.ShowModalSimulation((<PanelLeaderModels.Session>this.session).GetSubjectSession());
//                        });
//                        QUnit.test("Séance OK", function (assert) {
//                            assert.expect(19);
//                            var done = assert.async();
//                            let vm = <PanelLeader.ViewModels.ModalSimulationViewModel>this.vm;
//                            assert.ok(vm != undefined, "ModalSimulationViewModel chargé.");
//                            let productDesign = vm.SubjectSession.ListExperimentalDesigns.filter((x) => { return x.Type == "Product" })[0];
//                            let items = productDesign.GetSubjectItems("S001");
//                            let scores = [3, 5, 1];
//                            // Test de la séance
//                            vm.OnScreenChanged = (index: number) => {
//                                if (index == 0) {
//                                    // Ecran 1 : 2 textarea, 1 button
//                                    assert.ok(vm.SubjectSession.Progress.CurrentState.CurrentScreen == 0 && vm.Reader.CurrentScreen.Screen.Controls.length == 3, "Ecran 1 OK");
//                                    let button1 = <ScreenReader.Controls.CustomButton>vm.Reader.GetControlByName("CustomButton_1");
//                                    button1.Click();
//                                }
//                                if (index == 1) {
//                                    // Ecran 2 : 2 textarea, 1 button
//                                    assert.ok(vm.SubjectSession.Progress.CurrentState.CurrentScreen == 1 && vm.Reader.CurrentScreen.Screen.Controls.length == 3, "Ecran 2 OK");
//                                    let button2 = <ScreenReader.Controls.CustomButton>vm.Reader.GetControlByName("CustomButton_2");
//                                    button2.Click();
//                                }
//                                if (index == 2 || index == 4 || index == 6) {
//                                    // Ecran 3 : 2 textarea, 1 button                                   
//                                    assert.ok(vm.SubjectSession.Progress.CurrentState.CurrentScreen == index && vm.Reader.CurrentScreen.Screen.Controls.length == 3, "Ecran 3 OK");
//                                    let button3 = <ScreenReader.Controls.CustomButton>vm.Reader.GetControlByName("CustomButton_3");
//                                    button3.Click();
//                                }
//                                if (index == 3 || index == 5 || index == 7) {
//                                    // Ecran 4 : 1 textarea, 1 button, 1 discrete scale
//                                    let button4 = <ScreenReader.Controls.CustomButton>vm.Reader.GetControlByName("CustomButton_4");
//                                    let discreteScale = <ScreenReader.Controls.DiscreteScalesControl>vm.Reader.GetControlByName("DiscreteScalesControl_1");
//                                    assert.ok(vm.SubjectSession.Progress.CurrentState.CurrentScreen == index && vm.Reader.CurrentScreen.Screen.Controls.length == 3, "Ecran 4 OK");
//                                    assert.ok(vm.Reader.CurrentItemLabel == items[vm.Reader.CurrentProductRank - 1].Value, "Product label OK");
//                                    button4.Click();
//                                    assert.ok(vm.Reader.ValidationMessage.length > 0, "Erreur de validation OK");
//                                    discreteScale.ClickOn("A001", scores[vm.Reader.CurrentProductRank - 1]);
//                                    button4.Click();
//                                    assert.ok(vm.Reader.ValidationMessage.length == 0, "Validation OK");
//                                }
//                                if (index == 8) {
//                                    // Données enregistrées     
//                                    let d1 = vm.SubjectSession.Progress.GetData("S001", items[0].Key, "A001")[0];
//                                    let d2 = vm.SubjectSession.Progress.GetData("S001", items[1].Key, "A001")[0];
//                                    let d3 = vm.SubjectSession.Progress.GetData("S001", items[2].Key, "A001")[0];
//                                    assert.ok(d1.Score == scores[0] && d1.ProductRank == 1
//                                        && d2.Score == scores[1] && d2.ProductRank == 2
//                                        && d3.Score == scores[2] && d3.ProductRank == 3, "Données OK");
//                                    done();
//                                }
//                            };
//                            vm.Start();
//                        });
//                        context.afterEach(function (assert) {
//                            this.vm.Close();
//                        });
//                    });
//                });
//                QUnit.module("UploadViewModel", function (context) {
//                    context.beforeEach(function (assert) {
//                        var done = assert.async();
//                        this.app.OnUploadViewModelLoaded = ((vm: PanelLeader.ViewModels.UploadViewModel) => {
//                            this.vm = vm;
//                            done();
//                        });
//                        this.app.Menu.ShowViewUpload();
//                    });
//                    QUnit.test("constructor", function (assert) {
//                        assert.expect(1);
//                        var done = assert.async();
//                        let vm = <PanelLeader.ViewModels.UploadViewModel>this.vm;
//                        assert.ok(vm != undefined, "UploadViewModel chargé.");
//                        done();
//                    });
//                    QUnit.test("Changements dans le formulaire", function (assert) {
//                        assert.expect(3);
//                        var done = assert.async();
//                        let vm = <PanelLeader.ViewModels.UploadViewModel>this.vm;
//                        let session = <PanelLeaderModels.Session>this.session;
//                        assert.ok(vm.CanUpload == true && vm.InputUploadDescription.IsValid == false);
//                        vm.InputUploadDescription.Set("test");
//                        assert.ok(session.Upload.Description == "test" && vm.InputUploadDescription.IsValid == true); //TODO : test notify, test hasassociateddata
//                        vm.InputUploadDescription.Set("");
//                        assert.ok(session.Upload.Description == "" && vm.InputUploadDescription.IsValid == false && vm.CanUpload == true);
//                        //TODO : tester changements valides ou non du formulaire + autres éléments du formulaire                                           
//                        done();
//                    });
//                    QUnit.test("UploadSessionOnServer, DeleteSessionOnServer", function (assert) {
//                        assert.expect(5);
//                        var done = assert.async();
//                        let vm = <PanelLeader.ViewModels.UploadViewModel>this.vm;
//                        let session = <PanelLeaderModels.Session>this.session;
//                        assert.ok(session.Upload.ServerCode == undefined);
//                        assert.ok(this.app.Menu.IsUploaded == false, "IsUploaded OK.");
//                        vm.OnSessionUploaded = () => {
//                            assert.ok(session.Upload.ServerCode.length == 9, "Upload OK");
//                            assert.ok(this.app.Menu.IsUploaded == true, "IsUploaded OK.");
//                            vm.OnSessionDeleted = () => {
//                                assert.ok(session.Upload.ServerCode == undefined, "Delete OK");
//                                done();
//                            }
//                            vm.DeleteSessionOnServer(false); //TODO : test avec données
//                        }
//                        vm.UploadSessionOnServer();
//                    });
//                });
//                QUnit.module("MonitoringViewModel", function (context) {
//                    context.beforeEach(function (assert) {
//                        var done = assert.async();
//                        this.app.OnUploadViewModelLoaded = ((vm: PanelLeader.ViewModels.UploadViewModel) => {
//                            let session = <PanelLeaderModels.Session>this.session;
//                            vm.OnSessionUploaded = () => {
//                                this.app.OnMonitoringViewModelLoaded = ((vm: PanelLeader.ViewModels.MonitoringViewModel) => {
//                                    this.vm = vm;
//                                    done();
//                                });
//                                this.app.Menu.ShowViewMonitoring();
//                            }
//                            vm.UploadSessionOnServer();
//                        });
//                        this.app.Menu.ShowViewUpload();
//                    });
//                    QUnit.test("constructor", function (assert) {
//                        assert.expect(2);
//                        var done = assert.async();
//                        let vm = <PanelLeader.ViewModels.MonitoringViewModel>this.vm;
//                        vm.OnDataTableLoaded = (dt: Framework.Form.DataTable) => {
//                            assert.ok(vm != undefined, "MonitoringViewModel chargé.");
//                            assert.ok(dt.ListData.length == 10, "DataTable chargée.")
//                            //TODO
//                            // vm.UpdateMail
//                            //    vm.PrintMemo
//                            //    vm.DownloadSubjectSeancesAsZip
//                            //    vm.RefreshMonitoring
//                            //    vm.ResetUserProgress
//                            //    vm.ShowModalSendMail
//                            done();
//                        }
//                    });
//                    context.afterEach(function (assert) {
//                        var done = assert.async();
//                        this.app.OnUploadViewModelLoaded = ((vm: PanelLeader.ViewModels.UploadViewModel) => {
//                            vm.DeleteSessionOnServer(false);
//                            done();
//                        });
//                        this.app.Menu.ShowViewUpload();
//                    });
//                });
//            });
//        });
//    }
//}
//# sourceMappingURL=test.js.map