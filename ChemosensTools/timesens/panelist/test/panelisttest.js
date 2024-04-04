//module PanelistTest {
//    let panelistCompatibilityCheckResult: Framework.ModuleCompatibilityCheck;
//    export function Start() {
//        QUnit.module("Panelist", function (panelistContext) {
//            panelistContext.before(function (assert) {
//                return new Promise(function (resolve, reject) {
//                    Framework.DynamicLoader.AddScripts(['/ts/panelist.js'], () => {
//                        Test.LoadPage2('../panelist/index.html', () => {
//                            Panelist.Initialize((compatibilityCheckResult) => {
//                                panelistCompatibilityCheckResult = compatibilityCheckResult;
//                                resolve();
//                            });
//                        });
//                    });
//                });
//            });
//            QUnit.module("Main View", function (test) {
//                QUnit.test("Affichage OK", function (assert) {
//                    assert.expect(24);
//                    var done = assert.async();
//                    let controller = new Panelist.Controller([], true, panelistCompatibilityCheckResult);
//                    //Panelist.Controller.Initialize([], true, (controller) => {
//                    // Paramètres du controleur instanciés
//                    assert.ok(controller.ServerCode == "", "ServerCode OK.");
//                    assert.ok(controller.SubjectCode == "", "SubjectCode OK.");
//                    assert.ok(controller.Password == "", "Password OK.");
//                    assert.ok(controller.StartDemoParameter == "", "StartDemoParameter OK.");
//                    assert.ok(controller.IsInPanelLeaderMode == false, "IsInPanelLeaderMode OK.");
//                    // Eléments visibles ou non
//                    assert.ok(Test.IsVisible(controller.HeaderDiv) == true);
//                    assert.ok(controller.FooterView.IsVisible == true);
//                    assert.ok(controller.MainView.IsVisible == true);
//                    assert.ok(controller.ScreenReaderView.IsVisible == false);
//                    assert.ok(controller.RunSessionView.IsVisible == false);
//                    assert.ok(controller.RunFromServerCodeView.IsVisible == false);
//                    assert.ok(controller.RunFromLocalFileView.IsVisible == false);
//                    assert.ok(controller.SettingsView.IsVisible == false);
//                    assert.ok(controller.LocalSessionsView.IsVisible == false);
//                    assert.ok(controller.DownloadLocalSessionView.IsVisible == false);
//                    // Boutons du menu principal visibles
//                    assert.ok(Test.IsVisible(controller.MainView.BtnShowHelpMenu.HtmlElement) == true);
//                    assert.ok(Test.IsVisible(controller.MainView.BtnShowLocalSessionsMenu.HtmlElement) == true);
//                    assert.ok(Test.IsVisible(controller.MainView.BtnShowRunSessionMenu.HtmlElement) == true);
//                    assert.ok(Test.IsVisible(controller.MainView.BtnShowSettingsMenu.HtmlElement) == true);
//                    // Icône de compatibilité du footer affichée
//                    let btnCompatibilityCount: number = 0;
//                    Test.IsVisible(controller.FooterView.BtnBrowserCompatibility.HtmlElement) == true ? btnCompatibilityCount++ : null;
//                    Test.IsVisible(controller.FooterView.BtnBrowserCompatibilityError.HtmlElement) == true ? btnCompatibilityCount++ : null;
//                    Test.IsVisible(controller.FooterView.BtnBrowserCompatibilityIssue.HtmlElement) == true ? btnCompatibilityCount++ : null;
//                    assert.ok(btnCompatibilityCount == 1);
//                    //TODO : fenêtre compatibilité
//                    // Icône de connection internet du footer affichée
//                    let btnInternetCount: number = 0;
//                    Test.IsVisible(controller.FooterView.BtnInternetConnection.HtmlElement) == true ? btnInternetCount++ : null;
//                    Test.IsVisible(controller.FooterView.BtnNoInternetConnection.HtmlElement) == true ? btnInternetCount++ : null;
//                    assert.ok(btnInternetCount == 1);
//                    // Icône local storage du footer affichée
//                    assert.ok(Test.IsVisible(controller.FooterView.BtnLocalStorage.HtmlElement) == true);
//                    // Icône install du footer affichée
//                    assert.ok(Test.IsVisible(controller.FooterView.BtnInstall.HtmlElement) == true);
//                    //Affichage du numéro de version
//                    var done1 = assert.async();
//                    controller.FooterView.OnVersionChanged = () => {
//                        assert.ok(controller.FooterView.SpanVersion.Text.length > 2)
//                        done1();
//                    }
//                    //TODO:bookmark
//                    done();
//                });
//                //QUnit.test("Affichage de l'aide", function (assert) {
//                //    assert.expect(2);
//                //    var done = assert.async();
//                //    let controller: Panelist.Controller = new Panelist.Controller([], true, () => {
//                //        Framework.Test.SimulateClick("btnShowHelpMenu", () => {
//                //            //TODO : test affichage modal sans afficher popu
//                //            //jquery-modal blocker current
//                //            assert.ok(Framework.Test.AreVisible(["divMainMenu", "header", "footer"]) == true, "divSettings, header, footer visibles");
//                //            assert.ok(Framework.Test.AreNotVisible(["currentScreen", "divMainMenu", "divStartSessionFromServerCode", "divStartSessionFromLocalFile", "divLocalSessions", "divStartSession", "divDownloadLocalSession"]) == true, "Autres menus non visibles");
//                //            done();
//                //        });
//                //    });
//                //});
//                QUnit.test("Navigation depuis MainMenu vers menu RunSession", function (assert) {
//                    assert.expect(10);
//                    var done = assert.async();
//                    let controller = new Panelist.Controller([], true, panelistCompatibilityCheckResult);
//                    controller.MainView.BtnShowRunSessionMenu.DelayedClick()
//                        .then(() => {
//                            assert.ok(Test.IsVisible(controller.HeaderDiv) == true);
//                            assert.ok(controller.FooterView.IsVisible == true);
//                            assert.ok(controller.RunSessionView.IsVisible == true);
//                            assert.ok(controller.ScreenReaderView.IsVisible == false);
//                            assert.ok(controller.MainView.IsVisible == false);
//                            assert.ok(controller.RunFromServerCodeView.IsVisible == false);
//                            assert.ok(controller.RunFromLocalFileView.IsVisible == false);
//                            assert.ok(controller.SettingsView.IsVisible == false);
//                            assert.ok(controller.LocalSessionsView.IsVisible == false);
//                            assert.ok(controller.DownloadLocalSessionView.IsVisible == false);
//                            done();
//                            //TODO : affichage des éléments spécifiques de la page
//                        });
//                });
//                QUnit.test("Navigation depuis MainMenu vers menu Settings", function (assert) {
//                    assert.expect(10);
//                    var done = assert.async();
//                    let controller = new Panelist.Controller([], true, panelistCompatibilityCheckResult);
//                    controller.MainView.BtnShowSettingsMenu.DelayedClick()
//                        .then(() => {
//                            assert.ok(Test.IsVisible(controller.HeaderDiv) == true);
//                            assert.ok(controller.FooterView.IsVisible == true);
//                            assert.ok(controller.SettingsView.IsVisible == true);
//                            assert.ok(controller.ScreenReaderView.IsVisible == false);
//                            assert.ok(controller.MainView.IsVisible == false);
//                            assert.ok(controller.RunFromServerCodeView.IsVisible == false);
//                            assert.ok(controller.RunFromLocalFileView.IsVisible == false);
//                            assert.ok(controller.LocalSessionsView.IsVisible == false);
//                            assert.ok(controller.RunSessionView.IsVisible == false);
//                            assert.ok(controller.DownloadLocalSessionView.IsVisible == false);
//                            done();
//                            //TODO : affichage des éléments spécifiques de la page
//                        });
//                });
//                QUnit.test("Navigation depuis MainMenu vers menu Local sessions", function (assert) {
//                    assert.expect(10);
//                    var done = assert.async();
//                    let controller = new Panelist.Controller([], true, panelistCompatibilityCheckResult);
//                    controller.MainView.BtnShowLocalSessionsMenu.DelayedClick()
//                        .then(() => {
//                            assert.ok(Test.IsVisible(controller.HeaderDiv) == true);
//                            assert.ok(controller.FooterView.IsVisible == true);
//                            assert.ok(controller.SettingsView.IsVisible == false);
//                            assert.ok(controller.ScreenReaderView.IsVisible == false);
//                            assert.ok(controller.MainView.IsVisible == false);
//                            assert.ok(controller.RunFromServerCodeView.IsVisible == false);
//                            assert.ok(controller.RunFromLocalFileView.IsVisible == false);
//                            assert.ok(controller.LocalSessionsView.IsVisible == true);
//                            assert.ok(controller.RunSessionView.IsVisible == false);
//                            assert.ok(controller.DownloadLocalSessionView.IsVisible == false);
//                            done();
//                            //TODO : affichage des éléments spécifiques de la page
//                        });
//                });
//            });
//            QUnit.module("Run session View", function (test) {
//                QUnit.test("Navigation depuis menu run sessions vers menu principal", function (assert) {
//                    assert.expect(10);
//                    var done = assert.async();
//                    let controller = new Panelist.Controller([], true, panelistCompatibilityCheckResult);
//                    controller.MainView.BtnShowSettingsMenu.DelayedClick()
//                        .then(() => { controller.RunSessionView.BtnBackFromRunSessionMenu.DelayedClick() })
//                        .then(() => {
//                            assert.ok(Test.IsVisible(controller.HeaderDiv) == true);
//                            assert.ok(controller.FooterView.IsVisible == true);
//                            assert.ok(controller.SettingsView.IsVisible == false);
//                            assert.ok(controller.ScreenReaderView.IsVisible == false);
//                            assert.ok(controller.MainView.IsVisible == true);
//                            assert.ok(controller.RunFromServerCodeView.IsVisible == false);
//                            assert.ok(controller.RunFromLocalFileView.IsVisible == false);
//                            assert.ok(controller.LocalSessionsView.IsVisible == false);
//                            assert.ok(controller.RunSessionView.IsVisible == false);
//                            assert.ok(controller.DownloadLocalSessionView.IsVisible == false);
//                            done();
//                        });
//                });
//                QUnit.test("Navigation depuis menu RunSession vers menu RunSessionFromServerCode", function (assert) {
//                    assert.expect(10);
//                    var done = assert.async();
//                    let controller = new Panelist.Controller([], true, panelistCompatibilityCheckResult);
//                    controller.MainView.BtnShowRunSessionMenu.DelayedClick()
//                        .then(() => { controller.RunSessionView.BtnShowStartFromServerCodeMenu.DelayedClick() })
//                        .then(() => {
//                            // Visibilité des vues
//                            assert.ok(Test.IsVisible(controller.HeaderDiv) == true);
//                            assert.ok(controller.FooterView.IsVisible == true);
//                            assert.ok(controller.RunFromServerCodeView.IsVisible == true);
//                            assert.ok(controller.ScreenReaderView.IsVisible == false);
//                            assert.ok(controller.MainView.IsVisible == false);
//                            assert.ok(controller.RunSessionView.IsVisible == false);
//                            assert.ok(controller.RunFromLocalFileView.IsVisible == false);
//                            assert.ok(controller.SettingsView.IsVisible == false);
//                            assert.ok(controller.LocalSessionsView.IsVisible == false);
//                            assert.ok(controller.DownloadLocalSessionView.IsVisible == false);
//                            //TODO : affichage des éléments spécifiques de la page
//                            done();
//                        })
//                });
//                QUnit.test("Navigation depuis menu RunSession vers menu RunSessionFromLocalFile", function (assert) {
//                    assert.expect(10);
//                    var done = assert.async();
//                    let controller = new Panelist.Controller([], true, panelistCompatibilityCheckResult);
//                    controller.MainView.BtnShowRunSessionMenu.DelayedClick()
//                        .then(() => { controller.RunSessionView.BtnShowStartFromLocalFileMenu.DelayedClick() })
//                        .then(() => { controller.RunFromLocalFileView.BtnBackFromLocalFileMenu.DelayedClick() })
//                        .then(() => {
//                            // Visibilité des vues
//                            assert.ok(Test.IsVisible(controller.HeaderDiv) == true);
//                            assert.ok(controller.FooterView.IsVisible == true);
//                            assert.ok(controller.RunFromServerCodeView.IsVisible == false);
//                            assert.ok(controller.ScreenReaderView.IsVisible == false);
//                            assert.ok(controller.MainView.IsVisible == false);
//                            assert.ok(controller.RunSessionView.IsVisible == true);
//                            assert.ok(controller.RunFromLocalFileView.IsVisible == false);
//                            assert.ok(controller.SettingsView.IsVisible == false);
//                            assert.ok(controller.LocalSessionsView.IsVisible == false);
//                            assert.ok(controller.DownloadLocalSessionView.IsVisible == false);
//                            //TODO : affichage des éléments spécifiques de la page
//                            done();
//                        })
//                });
//            });
//            QUnit.module("Run session from server code View", function (test) {
//                QUnit.test("Navigation depuis menu run session from server code vers menu run session", function (assert) {
//                    assert.expect(10);
//                    var done = assert.async();
//                    let controller = new Panelist.Controller([], true, panelistCompatibilityCheckResult);
//                    controller.MainView.BtnShowRunSessionMenu.DelayedClick()
//                        .then(() => { controller.RunSessionView.BtnShowStartFromServerCodeMenu.DelayedClick() })
//                        .then(() => { controller.RunFromServerCodeView.BtnBackFromServerCodeMenu.DelayedClick() })
//                        .then(() => {
//                            assert.ok(Test.IsVisible(controller.HeaderDiv) == true);
//                            assert.ok(controller.FooterView.IsVisible == true);
//                            assert.ok(controller.SettingsView.IsVisible == false);
//                            assert.ok(controller.ScreenReaderView.IsVisible == false);
//                            assert.ok(controller.MainView.IsVisible == false);
//                            assert.ok(controller.RunFromServerCodeView.IsVisible == false);
//                            assert.ok(controller.RunFromLocalFileView.IsVisible == false);
//                            assert.ok(controller.LocalSessionsView.IsVisible == false);
//                            assert.ok(controller.RunSessionView.IsVisible == true);
//                            assert.ok(controller.DownloadLocalSessionView.IsVisible == false);
//                            done();
//                        });
//                });
//                QUnit.test("Input non valide (trop court) dans RunSessionFromServerCode", function (assert) {
//                    assert.expect(1);
//                    var done = assert.async();
//                    let controller = new Panelist.Controller([], true, panelistCompatibilityCheckResult);
//                    let error: string = "";
//                    controller.RunFromServerCodeView.OnGetListSubjectsForSeanceFailed = (error: string) => {
//                        assert.ok(error == Framework.LocalizationManager.Get("AtLeast6Digits"));
//                        // TODO : test tooltip
//                        done();
//                    };
//                    controller.MainView.BtnShowRunSessionMenu.DelayedClick()
//                        .then(() => {
//                            controller.RunSessionView.BtnShowStartFromServerCodeMenu.DelayedClick()
//                        })
//                        .then(() => {
//                            controller.RunFromServerCodeView.InputServerCode.Set('1234')
//                        })
//                });
//                QUnit.test("Input non valide (non numérique) RunSessionFromServerCode", function (assert) {
//                    assert.expect(1);
//                    var done = assert.async();
//                    let controller = new Panelist.Controller([], true, panelistCompatibilityCheckResult);
//                    let error: string = "";
//                    controller.RunFromServerCodeView.OnGetListSubjectsForSeanceFailed = (error: string) => {
//                        assert.ok(error == Framework.LocalizationManager.Get("NumericInputOnly"));
//                        // TODO : test tooltip
//                        done();
//                    };
//                    controller.MainView.BtnShowRunSessionMenu.DelayedClick()
//                        .then(() => { controller.RunSessionView.BtnShowStartFromServerCodeMenu.DelayedClick() })
//                        .then(() => {
//                            controller.RunFromServerCodeView.InputServerCode.Set('abcd')
//                        })
//                });
//                QUnit.test("Input non valide (code serveur non reconnu) dans RunSessionFromServerCode", function (assert) {
//                    assert.expect(1);
//                    var done = assert.async();
//                    let controller = new Panelist.Controller([], true, panelistCompatibilityCheckResult);
//                    let error: string = "";
//                    controller.RunFromServerCodeView.OnGetListSubjectsForSeanceFailed = (error: string) => {
//                        assert.ok(error == Framework.LocalizationManager.Get("NoMatchingServerCodeFound"));
//                        // TODO : test tooltip
//                        done();
//                    };
//                    controller.MainView.BtnShowRunSessionMenu.DelayedClick()
//                        .then(() => { controller.RunSessionView.BtnShowStartFromServerCodeMenu.DelayedClick() })
//                        .then(() => {
//                            controller.RunFromServerCodeView.InputServerCode.Set('123456789')
//                        })
//                });
//                QUnit.test("Input serveur code valide dans RunSessionFromServerCode", function (assert) {
//                    assert.expect(2);
//                    var done = assert.async();
//                    let controller = new Panelist.Controller([], true, panelistCompatibilityCheckResult);
//                    controller.RunFromServerCodeView.OnGetListSubjectsForSeanceCompleted = (listCodes: string[]) => {
//                        assert.ok(controller.ServerCode == '67095972');
//                        assert.ok(listCodes != undefined && listCodes.length == 3 && listCodes.indexOf('S001') == 0 && listCodes.indexOf('S002') == 1 && listCodes.indexOf('S003') == 2);
//                        done();
//                    };
//                    controller.MainView.BtnShowRunSessionMenu.DelayedClick()
//                        .then(() => {
//                            controller.RunSessionView.BtnShowStartFromServerCodeMenu.DelayedClick()
//                        })
//                        .then(() => {
//                            controller.RunFromServerCodeView.InputServerCode.Set('67095972')
//                        })
//                });
//                //TODO : input serveur code valide puis choix sujet valide/non valide (entrée manuelle ou choix dans drop-down)
//                //TODO : input serveur code valide puis choix sujet valide puis password valide/non valide
//                //TODO : click sur continue : lancement de la séance
//            });
//            QUnit.module("Run server from local file View", function (test) {
//                QUnit.test("Navigation depuis menu run session from local file vers menu run session", function (assert) {
//                    assert.expect(10);
//                    var done = assert.async();
//                    let controller = new Panelist.Controller([], true, panelistCompatibilityCheckResult);
//                    controller.MainView.BtnShowRunSessionMenu.DelayedClick()
//                        .then(() => { controller.RunSessionView.BtnShowStartFromLocalFileMenu.DelayedClick() })
//                        .then(() => { controller.RunFromLocalFileView.BtnBackFromLocalFileMenu.DelayedClick() })
//                        .then(() => {
//                            assert.ok(Test.IsVisible(controller.HeaderDiv) == true);
//                            assert.ok(controller.FooterView.IsVisible == true);
//                            assert.ok(controller.SettingsView.IsVisible == false);
//                            assert.ok(controller.ScreenReaderView.IsVisible == false);
//                            assert.ok(controller.MainView.IsVisible == false);
//                            assert.ok(controller.RunFromServerCodeView.IsVisible == false);
//                            assert.ok(controller.RunFromLocalFileView.IsVisible == false);
//                            assert.ok(controller.LocalSessionsView.IsVisible == false);
//                            assert.ok(controller.RunSessionView.IsVisible == true);
//                            assert.ok(controller.DownloadLocalSessionView.IsVisible == false);
//                            done();
//                        });
//                });
//                //QUnit.only("Lancement d'une séance locale", function (assert) {
//                //    assert.expect(11);
//                //    var done = assert.async();
//                //    Panelist.Controller.Initialize([], true, (controller) => {
//                //        controller.OnReaderLoaded = () => {
//                //            assert.ok(controller.Reader != undefined);
//                //            done();
//                //        }
//                //        Framework.Test.SimulateClick(controller.MainView.BtnShowRunSessionMenu)
//                //            .then(() => {
//                //                Framework.Test.SimulateClick(controller.RunSessionView.BtnShowStartFromLocalFileMenu)
//                //            })
//                //            .then(() => {
//                //                Framework.Test.SimulateInput(controller.RunFromLocalFileView.InputLocalFile, "123")
//                //            })
//                //            .then(() => {
//                //            });
//                //    });
//                //});
//            });
//            QUnit.module("Local files View", function (test) {
//                QUnit.test("Navigation depuis menu local files vers menu principal", function (assert) {
//                    assert.expect(10);
//                    var done = assert.async();
//                    let controller = new Panelist.Controller([], true, panelistCompatibilityCheckResult);
//                    controller.MainView.BtnShowLocalSessionsMenu.DelayedClick()
//                        .then(() => { controller.LocalSessionsView.BtnBackFromLocalSessionsMenu.DelayedClick() })
//                        .then(() => {
//                            assert.ok(Test.IsVisible(controller.HeaderDiv) == true);
//                            assert.ok(controller.FooterView.IsVisible == true);
//                            assert.ok(controller.SettingsView.IsVisible == false);
//                            assert.ok(controller.ScreenReaderView.IsVisible == false);
//                            assert.ok(controller.MainView.IsVisible == true);
//                            assert.ok(controller.RunFromServerCodeView.IsVisible == false);
//                            assert.ok(controller.RunFromLocalFileView.IsVisible == false);
//                            assert.ok(controller.LocalSessionsView.IsVisible == false);
//                            assert.ok(controller.RunSessionView.IsVisible == false);
//                            assert.ok(controller.DownloadLocalSessionView.IsVisible == false);
//                            done();
//                        });
//                });
//                // TODO : affichage de l'espace dispo
//                // TODO : affichage du tableau
//                // TODO : actions download, zip, delete, reset, synchronize
//            });
//            QUnit.module("Settings View", function (test) {
//                QUnit.test("Navigation depuis menu Settings vers menu principal", function (assert) {
//                    assert.expect(10);
//                    var done = assert.async();
//                    let controller = new Panelist.Controller([], true, panelistCompatibilityCheckResult);
//                    controller.MainView.BtnShowSettingsMenu.DelayedClick()
//                        .then(() => { controller.SettingsView.BtnBackFromSettingsMenu.DelayedClick() })
//                        .then(() => {
//                            assert.ok(Test.IsVisible(controller.HeaderDiv) == true);
//                            assert.ok(controller.FooterView.IsVisible == true);
//                            assert.ok(controller.SettingsView.IsVisible == false);
//                            assert.ok(controller.ScreenReaderView.IsVisible == false);
//                            assert.ok(controller.MainView.IsVisible == true);
//                            assert.ok(controller.RunFromServerCodeView.IsVisible == false);
//                            assert.ok(controller.RunFromLocalFileView.IsVisible == false);
//                            assert.ok(controller.LocalSessionsView.IsVisible == false);
//                            assert.ok(controller.RunSessionView.IsVisible == false);
//                            assert.ok(controller.DownloadLocalSessionView.IsVisible == false);
//                            done();
//                        });
//                });
//                QUnit.test("Changement de langue depuis le menu Settings", function (assert) {
//                    assert.expect(6);
//                    var done = assert.async();
//                    //TODO : test affichage d'un texte
//                    let controller = new Panelist.Controller([], true, panelistCompatibilityCheckResult);
//                    Framework.LocalizationManager.SetDisplayLanguage('en');
//                    controller.MainView.BtnShowSettingsMenu.DelayedClick()
//                        .then(() => {
//                            controller.SettingsView.BtnToggleLanguage.DelayedClick()
//                        })
//                        .then(() => {
//                            assert.ok(Framework.LocalizationManager.GetDisplayLanguage() == 'fr', "Changement en->fr OK");
//                            assert.ok(Framework.LocalStorage.GetFromLocalStorage("Language") == 'fr', "Stockage dans Isolated storage OK");
//                            assert.ok(controller.SettingsView.BtnToggleLanguageValue == 'FR', "Affichage langue OK")
//                        })
//                        .then(() => {
//                            controller.SettingsView.BtnToggleLanguage.DelayedClick()
//                        })
//                        .then(() => {
//                            assert.ok(Framework.LocalizationManager.GetDisplayLanguage() == 'en', "Changement fr->en OK");
//                            assert.ok(Framework.LocalStorage.GetFromLocalStorage("Language") == 'en', "Stockage dans Isolated storage OK");
//                            assert.ok(controller.SettingsView.BtnToggleLanguageValue == 'EN', "Affichage langue OK")
//                            done();
//                        });
//                });
//                QUnit.test("Toggle virtual keyboard depuis le menu Settings", function (assert) {
//                    assert.expect(6);
//                    var done = assert.async();
//                    let controller = new Panelist.Controller([], true, panelistCompatibilityCheckResult);
//                    let virtualKeyboardEnabled = controller.IsVirtualKeyboardEnabled;
//                    //TODO : test affichage du clavier
//                    controller.MainView.BtnShowSettingsMenu.DelayedClick()
//                        .then(() => {
//                            controller.SettingsView.BtnToggleVirtualKeyboard.DelayedClick()
//                        })
//                        .then(() => {
//                            assert.ok(controller.IsVirtualKeyboardEnabled == !virtualKeyboardEnabled, "Toggle 1 OK");
//                            assert.ok(Framework.LocalStorage.GetFromLocalStorage("VirtualKeyboardEnabled") == JSON.stringify(controller.IsVirtualKeyboardEnabled), "Stockage dans Isolated storage OK");
//                            assert.ok(controller.SettingsView.BtnToggleVirtualKeyboardValue == controller.SettingsView.BoolToSwitch(controller.IsVirtualKeyboardEnabled), "Affichage on/off OK");
//                        })
//                        .then(() => {
//                            controller.SettingsView.BtnToggleVirtualKeyboard.DelayedClick()
//                        })
//                        .then(() => {
//                            assert.ok(controller.IsVirtualKeyboardEnabled == virtualKeyboardEnabled, "Toggle 2 OK");
//                            assert.ok(Framework.LocalStorage.GetFromLocalStorage("VirtualKeyboardEnabled") == JSON.stringify(controller.IsVirtualKeyboardEnabled), "Stockage dans Isolated storage OK");
//                            assert.ok(controller.SettingsView.BtnToggleVirtualKeyboardValue == controller.SettingsView.BoolToSwitch(controller.IsVirtualKeyboardEnabled), "Affichage on/off OK");
//                            done();
//                        });
//                });
//                QUnit.test("Toggle full screen depuis le menu Settings", function (assert) {
//                    assert.expect(4);
//                    var done = assert.async();
//                    let controller = new Panelist.Controller([], true, panelistCompatibilityCheckResult);
//                    let fullScreen = Framework.Browser.IsFullScreen;
//                    //TODO : test affichage du clavier
//                    controller.MainView.BtnShowSettingsMenu.DelayedClick()
//                        .then(() => {
//                            controller.SettingsView.BtnToggleFullScreen.DelayedClick()
//                        })
//                        .then(() => {
//                            assert.ok(Framework.Browser.IsFullScreen == !fullScreen, "Toggle 1 OK");
//                            assert.ok(controller.SettingsView.BtnToggleFullScreenValue == controller.SettingsView.BoolToSwitch(Framework.Browser.IsFullScreen), "Affichage on/off OK");
//                        })
//                        .then(() => {
//                            controller.SettingsView.BtnToggleFullScreen.DelayedClick()
//                        })
//                        .then(() => {
//                            assert.ok(Framework.Browser.IsFullScreen == fullScreen, "Toggle 2 OK");
//                            assert.ok(controller.SettingsView.BtnToggleFullScreenValue == controller.SettingsView.BoolToSwitch(Framework.Browser.IsFullScreen), "Affichage on/off OK");
//                            done();
//                        });
//                });
//                QUnit.test("Toggle synchronisation depuis le menu Settings", function (assert) {
//                    assert.expect(6);
//                    var done = assert.async();
//                    let controller = new Panelist.Controller([], true, panelistCompatibilityCheckResult);
//                    let autoSynchronization = controller.IsAutoSynchronized;
//                    //TODO : test synchro au démarrage
//                    controller.MainView.BtnShowSettingsMenu.DelayedClick()
//                        .then(() => {
//                            controller.SettingsView.BtnToggleSynchronization.DelayedClick()
//                        })
//                        .then(() => {
//                            assert.ok(controller.IsAutoSynchronized == !autoSynchronization, "Toggle 1 OK");
//                            assert.ok(Framework.LocalStorage.GetFromLocalStorage("AutoSynchronization") == JSON.stringify(controller.IsAutoSynchronized), "Stockage dans Isolated storage OK");
//                            assert.ok(controller.SettingsView.BtnToggleSynchronizationValue == controller.SettingsView.BoolToSwitch(controller.IsAutoSynchronized), "Affichage on/off OK");
//                        })
//                        .then(() => {
//                            controller.SettingsView.BtnToggleSynchronization.DelayedClick()
//                        })
//                        .then(() => {
//                            assert.ok(controller.IsVirtualKeyboardEnabled == autoSynchronization, "Toggle 2 OK");
//                            assert.ok(Framework.LocalStorage.GetFromLocalStorage("AutoSynchronization") == JSON.stringify(controller.IsAutoSynchronized), "Stockage dans Isolated storage OK");
//                            assert.ok(controller.SettingsView.BtnToggleSynchronizationValue == controller.SettingsView.BoolToSwitch(controller.IsAutoSynchronized), "Affichage on/off OK");
//                            done();
//                        });
//                });
//                //QUnit.only("Toggle lock depuis le menu Settings", function (assert) {
//                //    assert.expect(6);
//                //    var done = assert.async();
//                //    Panelist.Controller.Initialize([], true, (controller) => {
//                //        let locked = controller.IsLocked;
//                //        //TODO : test éléments bloqués
//                //        //TODO : gestion de la fenêtre
//                //        Framework.Test.SimulateClick(controller.MainView.BtnShowSettingsMenu)
//                //            .then(() => {
//                //                Framework.Test.SimulateClick(controller.SettingsView.BtnToggleLock)
//                //            })
//                //            .then(() => {
//                //                assert.ok(controller.IsLocked == !locked, "Toggle 1 OK");
//                //                assert.ok(Framework.LocalStorage.GetFromLocalStorage("IsLock") == JSON.stringify(controller.IsLocked), "Stockage dans Isolated storage OK");
//                //                assert.ok(controller.SettingsView.BtnToggleLockValue == controller.SettingsView.BoolToSwitch(controller.IsLocked), "Affichage on/off OK");
//                //            })
//                //            .then(() => {
//                //                Framework.Test.SimulateClick(controller.SettingsView.BtnToggleLock)
//                //            })
//                //            .then(() => {
//                //                assert.ok(controller.IsLocked== locked, "Toggle 2 OK");
//                //                assert.ok(Framework.LocalStorage.GetFromLocalStorage("IsLockd") == JSON.stringify(controller.IsLocked), "Stockage dans Isolated storage OK");
//                //                assert.ok(controller.SettingsView.BtnToggleLockValue == controller.SettingsView.BoolToSwitch(controller.IsLocked), "Affichage on/off OK");
//                //                done();
//                //            });
//                //    });
//                //});
//            });
//            QUnit.module("Initialisation avec paramètres servercode, subjectcode, password", function (test) {
//                //TODO + langue, anonymous, 1 seul paramètre saisi...
//            });
//            QUnit.module("Initialisation avec paramètre startdemo", function (test) {
//                QUnit.test("index.html?startdemo=profile", function (assert) {
//                    assert.expect(2);
//                    var query = [];
//                    query.push('startdemo');
//                    query['startdemo'] = 'profile';
//                    var done = assert.async();
//                    let controller = new Panelist.Controller(query, true, panelistCompatibilityCheckResult);
//                    assert.ok(controller.StartDemoParameter == "profile", "StartDemoParameter OK.");
//                    controller.OnReaderLoaded = () => {
//                        let textarea1: ScreenReader.Controls.TextArea = controller.Reader.GetElementsOfType("TextArea")[0];
//                        let img: ScreenReader.Controls.CustomImage = controller.Reader.GetElementsOfType("CustomImage")[0];
//                        //let custombutton1: Controls.CustomButton = controller.Reader.GetElementsOfType("CustomButton")[0];
//                        let res = true;
//                        res = res && $(textarea1.HtmlElement).text().indexOf("Quantitative Descriptive Analysis demo") > -1;
//                        res = res && img != undefined;
//                        //res = res && custombutton1._Action == "GoToNextPage";
//                        assert.ok(res == true, "Welcome screen OK");
//                        done();
//                    }
//                })
//                QUnit.test("index.html?startdemo=tds", function (assert) {
//                    assert.expect(11);
//                    var query = [];
//                    query.push('startdemo');
//                    query['startdemo'] = 'tds';
//                    var done = assert.async();
//                    let controller = new Panelist.Controller(query, true, panelistCompatibilityCheckResult);
//                    assert.ok(controller.StartDemoParameter == "tds", "StartDemoParameter OK.");
//                    controller.OnReaderLoaded = () => {
//                        let screen1_textarea: ScreenReader.Controls.TextArea = controller.Reader.GetElementsOfType("TextArea")[0];
//                        let screen1_img: ScreenReader.Controls.CustomImage = controller.Reader.GetElementsOfType("CustomImage")[0];
//                        let screen1_anchor: ScreenReader.Controls.AnchorControl = controller.Reader.GetElementsOfType("AnchorControl")[0];
//                        let screen1_custombuttons: ScreenReader.Controls.CustomButton[] = controller.Reader.GetElementsOfType("CustomButton");
//                        let screen1_regularTDSbutton: ScreenReader.Controls.CustomButton = screen1_custombuttons.filter((x) => { return x._Content == "Regular TDS, with START, STOP and chronometer"; })[0];
//                        let res = true;
//                        res = res && screen1_textarea != undefined;
//                        res = res && screen1_img != undefined;
//                        res = res && screen1_anchor != undefined && screen1_anchor._AnchorName == "Home";
//                        res = res && screen1_regularTDSbutton != undefined && screen1_regularTDSbutton._Action == "GoToAnchor" && screen1_regularTDSbutton._AnchorID == "18031108";
//                        assert.ok(res == true, "Welcome screen OK");
//                        // Renvoi vers écran "Regular TDS"
//                        screen1_regularTDSbutton.Click();
//                        let screen2_textarea: ScreenReader.Controls.TextArea = controller.Reader.GetElementsOfType("TextArea")[0];
//                        let screen2_anchor: ScreenReader.Controls.AnchorControl = controller.Reader.GetElementsOfType("AnchorControl")[0];
//                        let screen2_custombutton: ScreenReader.Controls.CustomButton = controller.Reader.GetElementsOfType("CustomButton")[0];
//                        res = res && screen2_textarea != undefined;
//                        res = res && screen2_anchor != undefined && screen2_anchor._AnchorName == "Regular";
//                        res = res && screen2_custombutton != undefined && screen2_custombutton._Action == "GoToNextPage";
//                        assert.ok(res == true, "Regular TDS écran d'instructions OK");
//                        // Ecran de mesure "Regular TDS"
//                        screen2_custombutton.Click();
//                        let screen3_textarea: ScreenReader.Controls.TextArea = controller.Reader.GetElementsOfType("TextArea")[0]; // Label
//                        let screen3_chrono: ScreenReader.Controls.CustomChronometer = controller.Reader.GetElementsOfType("CustomChronometer")[0];
//                        let screen3_custombuttons: ScreenReader.Controls.CustomButton[] = controller.Reader.GetElementsOfType("CustomButton");
//                        let screen3_startbutton: ScreenReader.Controls.CustomButton = screen3_custombuttons.filter((x) => { return x._Content == "Start"; })[0];
//                        let screen3_stopbutton: ScreenReader.Controls.CustomButton = screen3_custombuttons.filter((x) => { return x._Content == "Stop"; })[0];
//                        let screen3_nextbutton: ScreenReader.Controls.CustomButton = screen3_custombuttons.filter((x) => { return x._Content == "Next"; })[0];
//                        let screen3_dts: ScreenReader.Controls.DTSButtonsControl = controller.Reader.GetElementsOfType("DTSButtonsControl")[0];
//                        let screen3_dtsbuttons: ScreenReader.Controls.CustomButton[] = screen3_dts.GetListButtons();
//                        res = res && screen3_textarea != undefined && screen3_textarea._HtmlContent.indexOf("Regular TDS, sample 356") > -1;
//                        res = res && screen3_chrono != undefined && screen3_chrono._MaxTime == 40 && screen3_chrono.GetTime() == 0;
//                        res = res && screen3_startbutton != undefined && screen3_startbutton._Action == "StartChronometer" && screen3_startbutton.IsEnabled == true;
//                        res = res && screen3_stopbutton != undefined && screen3_stopbutton._Action == "StopChronometer" && screen3_stopbutton.IsEnabled == false;
//                        res = res && screen3_nextbutton != undefined && screen3_nextbutton._Action == "GoToAnchor" && screen3_nextbutton._AnchorID == "36120384";
//                        res = res && screen3_dts != undefined && screen3_dts._DominanceMode == "DominantUntilNextClick" && screen3_dts.IsEnabled == false;
//                        res = res && screen3_dtsbuttons.length == 10;
//                        screen3_dtsbuttons.forEach((x) => { res = res && x.IsEnabled == false });
//                        assert.ok(res == true, "Regular TDS écran de mesure initialisé");
//                        // Clic sur Start
//                        screen3_startbutton.Click();
//                        //TODO : utiliser screenchanged à la place de settimeout
//                        setTimeout(function () {
//                            res = res && screen3_startbutton.IsEnabled == false;
//                            res = res && screen3_stopbutton.IsEnabled == true;
//                            res = res && screen3_chrono.GetTime() > 0;
//                            screen3_dtsbuttons.forEach((x) => { res = res && x.IsEnabled == true });
//                            assert.ok(res == true, "Clic sur START démarre le chrono et rend les boutons DTS actifs.");
//                            // Erreur de validation (pas bouton dts cliqué)
//                            screen3_stopbutton.Click();
//                            res = res && screen3_dts.IsValid == false;
//                            assert.ok(res == true, "Erreur de validation si aucun descripteur sélectionné.");
//                            // Clic sur Descripteur_02
//                            let screen3_desc2 = screen3_dtsbuttons.filter((x) => { return x._Content == "Descriptor 02" })[0];
//                            res = res && screen3_desc2._Background.G == 226 && screen3_desc2._Background.R == 204 && screen3_desc2._Background.V == 242;
//                            screen3_desc2.Click();
//                            res = res && screen3_desc2._Background.G == 165 && screen3_desc2._Background.R == 255 && screen3_desc2._Background.V == 0;
//                            res = res && screen3_dts.IsValid == true;
//                            assert.ok(res == true, "Clic sur Descripteur 02 OK");
//                            // Clic sur Descripteur_04
//                            let screen3_desc4 = screen3_dtsbuttons.filter((x) => { return x._Content == "Descriptor 04" })[0];
//                            res = res && screen3_desc4._Background.G == 226 && screen3_desc4._Background.R == 204 && screen3_desc4._Background.V == 242;
//                            screen3_desc4.Click();
//                            res = res && screen3_desc4._Background.G == 165 && screen3_desc4._Background.R == 255 && screen3_desc4._Background.V == 0;
//                            res = res && screen3_desc2._Background.G == 226 && screen3_desc2._Background.R == 204 && screen3_desc2._Background.V == 242;
//                            assert.ok(res == true, "Clic sur Descripteur 04 OK");
//                            // Clic sur Descripteur_05
//                            let screen3_desc5 = screen3_dtsbuttons.filter((x) => { return x._Content == "Descriptor 05" })[0];
//                            res = res && screen3_desc5._Background.G == 226 && screen3_desc5._Background.R == 204 && screen3_desc5._Background.V == 242;
//                            screen3_desc5.Click();
//                            res = res && screen3_desc5._Background.G == 165 && screen3_desc5._Background.R == 255 && screen3_desc5._Background.V == 0;
//                            res = res && screen3_desc2._Background.G == 226 && screen3_desc2._Background.R == 204 && screen3_desc2._Background.V == 242;
//                            res = res && screen3_desc4._Background.G == 226 && screen3_desc4._Background.R == 204 && screen3_desc4._Background.V == 242;
//                            assert.ok(res == true, "Clic sur Descripteur 05 OK");
//                            screen3_chrono._MaxTime = 2;
//                            //TODO : utiliser maxtimereached plutôt que settimeout
//                            setTimeout(function () {
//                                // Attente de max time (ramené à 2 secondes)
//                                res = res && screen3_chrono.GetTime() >= 2000;
//                                res = res && screen3_startbutton.IsEnabled == false;
//                                res = res && screen3_stopbutton.IsEnabled == false;
//                                screen3_dtsbuttons.forEach((x) => { res = res && x.IsEnabled == false });
//                                assert.ok(res == true, "Max time OK");
//                                // Enregistrement des des données
//                                screen3_nextbutton.Click();
//                                let screen3_data0 = Test.GetData(controller.Reader.Session.Progress.ListData, "START", null, 24553470, "Product_01", 1, 1, 1, 1024984386, "S001", "TDS");
//                                let screen3_data1 = Test.GetData(controller.Reader.Session.Progress.ListData, "Descriptor_02", 2, 24553470, "Product_01", 1, 1, 1, 1024984386, "S001", "TDS");
//                                let screen3_data2 = Test.GetData(controller.Reader.Session.Progress.ListData, "Descriptor_04", 4, 24553470, "Product_01", 1, 1, 1, 1024984386, "S001", "TDS");
//                                let screen3_data3 = Test.GetData(controller.Reader.Session.Progress.ListData, "Descriptor_05", 5, 24553470, "Product_01", 1, 1, 1, 1024984386, "S001", "TDS");
//                                let screen3_data4 = Test.GetData(controller.Reader.Session.Progress.ListData, "STOP", null, 24553470, "Product_01", 1, 1, 1, 1024984386, "S001", "TDS");
//                                res = res && controller.Reader.Session.Progress.ListData.length == 5 && screen3_data0.Time == 0 && screen3_data0.Time <= screen3_data1.Time && screen3_data2.Time <= screen3_data3.Time && screen3_data4.Time >= 2;
//                                assert.ok(res == true, "Enregistrement données OK");
//                                done();
//                            }, 2000)
//                        }, 100);
//                    }
//                })
//                QUnit.test("index.html?startdemo=cata", function (assert) {
//                    assert.expect(8);
//                    var done1 = assert.async();
//                    var query = [];
//                    query.push('startdemo');
//                    query['startdemo'] = 'cata';
//                    let controller = new Panelist.Controller(query, true, panelistCompatibilityCheckResult);
//                    controller.OnReaderLoaded = () => {
//                        let textarea1: ScreenReader.Controls.TextArea = controller.Reader.GetElementsOfType("TextArea")[0];
//                        let img: ScreenReader.Controls.CustomImage = controller.Reader.GetElementsOfType("CustomImage")[0];
//                        let custombutton1: ScreenReader.Controls.CustomButton = controller.Reader.GetElementsOfType("CustomButton")[0];
//                        let res = true;
//                        res = res && $(textarea1.HtmlElement).text().indexOf("Welcome to this demo session of Check All That Apply") > -1;
//                        res = res && img != undefined;
//                        res = res && custombutton1._Action == "GoToNextPage";
//                        assert.ok(res == true, "Welcome screen OK");
//                        custombutton1.Click();
//                        let textarea2: ScreenReader.Controls.TextArea = controller.Reader.GetElementsOfType("TextArea")[0];
//                        let custombutton2: ScreenReader.Controls.CustomButton = controller.Reader.GetElementsOfType("CustomButton")[0];
//                        let cata: ScreenReader.Controls.CATAControl = controller.Reader.GetElementsOfType("CATAControl")[0];
//                        let listCb: ScreenReader.Controls.CustomCheckBox[] = cata.GetListCheckboxes();
//                        let cb0: ScreenReader.Controls.CustomCheckBox = listCb[0];
//                        let cb1: ScreenReader.Controls.CustomCheckBox = listCb[1];
//                        let cb2: ScreenReader.Controls.CustomCheckBox = listCb[2];
//                        res = true;
//                        res = res && $(textarea2.HtmlElement).text().indexOf("Please check attributes applicable to sample 894") > -1;
//                        res = res && controller.Reader.Session.Progress.CurrentState.CurrentScreen == 1;
//                        res = res && cata.Items.length == 20;
//                        res = res && cata.IsEnabled == true;
//                        res = res && cata.IsValid == false; // Pas de case cochée : non valide
//                        res = res && custombutton2._Action == "GoToNextPage";
//                        res = res && cb0.AttributeCode == "Descriptor_02"; //TODO : test label                
//                        res = res && cb1.AttributeCode == "Descriptor_20"; //TODO : test label  
//                        res = res && cb2.AttributeCode == "Descriptor_03"; //TODO : test label  
//                        listCb.forEach((x) => res = res && (x.IsEnabled == true));
//                        assert.ok(res == true, "Ecran de mesure OK");
//                        // Clic sur NEXT : erreur de validation
//                        custombutton2.Click();
//                        res = true;
//                        res = res && controller.Reader.Session.Progress.CurrentState.CurrentScreen == 1;
//                        res = res && cata.IsValid == false;
//                        res = res && cata.ValidationMessage == Framework.LocalizationManager.Get('AtLeastOneAttributeHaveToBeSelected');
//                        assert.ok(res == true, "Pas de passage à l'écran suivant si aucun descripteur sélectionné");
//                        // Clic sur Descriptor_02
//                        cb0.Click();
//                        res = true;
//                        res = res && cb0.IsChecked == true;
//                        res = res && cata.IsValid == true;
//                        res = res && cata.ValidationMessage == "";
//                        res = res && cata.ListData.filter((x) => { return x.AttributeCode == "Descriptor_02" && x.Score == 1 }).length == 1;
//                        assert.ok(res == true, "Un descripteur sélectionné : contrôle OK.");
//                        // Clic sur Descriptor_02 (unclick)
//                        cb0.Click();
//                        res = true;
//                        res = res && cb0.IsChecked == false;
//                        res = res && cata.IsValid == false;
//                        res = res && cata.ValidationMessage == Framework.LocalizationManager.Get('AtLeastOneAttributeHaveToBeSelected');
//                        res = res && cata.ListData.filter((x) => { return x.AttributeCode == "Descriptor_02" && x.Score == 0 }).length == 1;
//                        assert.ok(res == true, "Unclick : aucun descripteur sélectionné");
//                        // Clic sur Descriptor_20, Descriptor_03, Descriptor_02
//                        cb1.Click();
//                        cb2.Click();
//                        cb0.Click();
//                        res = true;
//                        res = res && cb0.IsChecked == true;
//                        res = res && cb1.IsChecked == true;
//                        res = res && cb2.IsChecked == true;
//                        res = res && cata.IsValid == true;
//                        res = res && cata.ValidationMessage == "";
//                        res = res && cata.ListData.length == 20;
//                        res = res && Test.DataExists(cata.ListData, "Descriptor_02", 1, 57941668, "Product_01", 1, 1, 1, 97739499, "S001", "CATA");
//                        res = res && Test.DataExists(cata.ListData, "Descriptor_20", 2, 57941668, "Product_01", 1, 1, 1, 97739499, "S001", "CATA");
//                        res = res && Test.DataExists(cata.ListData, "Descriptor_03", 3, 57941668, "Product_01", 1, 1, 1, 97739499, "S001", "CATA");
//                        ["01", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"].forEach((x) => res = res && Test.DataExists(cata.ListData, "Descriptor_" + x, null, 57941668, "Product_01", 1, 1, 0, 97739499, "S001", "CATA"));
//                        assert.ok(res == true, "3 descripteurs sélectionné puis click sur NEXT : enregistrement données OK.");
//                        // Clic sur NEXT : passage écran suivant
//                        custombutton2.Click();
//                        let textarea3: ScreenReader.Controls.TextArea = controller.Reader.GetElementsOfType("TextArea")[0];
//                        let custombutton3: ScreenReader.Controls.CustomButton = controller.Reader.GetElementsOfType("CustomButton")[0];
//                        let cata2: ScreenReader.Controls.CATAControl = controller.Reader.GetElementsOfType("CATAControl")[0];
//                        let listCb2: ScreenReader.Controls.CustomCheckBox[] = cata2.GetListCheckboxes();
//                        let cb3: ScreenReader.Controls.CustomCheckBox = listCb2[3];
//                        let cb4: ScreenReader.Controls.CustomCheckBox = listCb2[4];
//                        let cb5: ScreenReader.Controls.CustomCheckBox = listCb2[5];
//                        res = true;
//                        res = res && controller.Reader.Session.Progress.CurrentState.CurrentScreen == 2;
//                        res = res && $(textarea3.HtmlElement).text().indexOf("Please check attributes applicable to sample 685") > -1;
//                        res = res && cata2.Items.length == 20;
//                        res = res && cata2.IsEnabled == true;
//                        res = res && cata2.IsValid == false; // Pas de case cochée : non valide
//                        res = res && custombutton3._Action == "GoToNextPage";
//                        res = res && cb3.AttributeCode == "Descriptor_18";
//                        res = res && cb4.AttributeCode == "Descriptor_04";
//                        res = res && cb5.AttributeCode == "Descriptor_01";
//                        listCb.forEach((x) => res = res && (x.IsEnabled == true));
//                        assert.ok(res == true, "Passage à l'écran suivant OK.");
//                        // Ecran 2
//                        cb3.Click();
//                        cb4.Click();
//                        cb5.Click();
//                        custombutton3.Click();
//                        res = true;
//                        // Ecran 3
//                        let textarea4: ScreenReader.Controls.TextArea = controller.Reader.GetElementsOfType("TextArea")[0];
//                        let custombutton4: ScreenReader.Controls.CustomButton = controller.Reader.GetElementsOfType("CustomButton")[0];
//                        let cata3: ScreenReader.Controls.CATAControl = controller.Reader.GetElementsOfType("CATAControl")[0];
//                        let listCb3: ScreenReader.Controls.CustomCheckBox[] = cata3.GetListCheckboxes();
//                        let cb6: ScreenReader.Controls.CustomCheckBox = listCb3[6];
//                        let cb7: ScreenReader.Controls.CustomCheckBox = listCb3[7];
//                        let cb8: ScreenReader.Controls.CustomCheckBox = listCb3[8];
//                        res = res && $(textarea4.HtmlElement).text().indexOf("Please check attributes applicable to sample 496") > -1;
//                        cb6.Click();
//                        cb7.Click();
//                        cb8.Click();
//                        custombutton4.Click();
//                        // Ecran 4
//                        let custombutton5: ScreenReader.Controls.CustomButton = controller.Reader.GetElementsOfType("CustomButton")[0];
//                        res = res && custombutton5._Action == "GoToUrl";
//                        //TODO : test navigation externe
//                        res = res && Test.DataExists(controller.Reader.Session.Progress.ListData, "Descriptor_02", 1, 57941668, "Product_01", 1, 1, 1, 97739499, "S001", "CATA");
//                        res = res && Test.DataExists(controller.Reader.Session.Progress.ListData, "Descriptor_20", 2, 57941668, "Product_01", 1, 1, 1, 97739499, "S001", "CATA");
//                        res = res && Test.DataExists(controller.Reader.Session.Progress.ListData, "Descriptor_03", 3, 57941668, "Product_01", 1, 1, 1, 97739499, "S001", "CATA");
//                        res = res && Test.DataExists(controller.Reader.Session.Progress.ListData, "Descriptor_18", 4, 57941668, "Product_03", 2, 1, 1, 97739499, "S001", "CATA");
//                        res = res && Test.DataExists(controller.Reader.Session.Progress.ListData, "Descriptor_04", 5, 57941668, "Product_03", 2, 1, 1, 97739499, "S001", "CATA");
//                        res = res && Test.DataExists(controller.Reader.Session.Progress.ListData, "Descriptor_01", 6, 57941668, "Product_03", 2, 1, 1, 97739499, "S001", "CATA");
//                        res = res && Test.DataExists(controller.Reader.Session.Progress.ListData, "Descriptor_09", 7, 57941668, "Product_02", 3, 1, 1, 97739499, "S001", "CATA");
//                        res = res && Test.DataExists(controller.Reader.Session.Progress.ListData, "Descriptor_14", 8, 57941668, "Product_02", 3, 1, 1, 97739499, "S001", "CATA");
//                        res = res && Test.DataExists(controller.Reader.Session.Progress.ListData, "Descriptor_17", 9, 57941668, "Product_02", 3, 1, 1, 97739499, "S001", "CATA");
//                        assert.ok(res == true, "Séance terminée.");
//                        done1();
//                    }
//                });
//                QUnit.test("index.html?startdemo=TCATA", function (assert) {
//                    assert.expect(9);
//                    var done1 = assert.async();
//                    var query = [];
//                    query.push('startdemo');
//                    query['startdemo'] = 'tcata';
//                    let controller = new Panelist.Controller(query, true, panelistCompatibilityCheckResult);
//                    controller.OnReaderLoaded = () => {
//                        let textarea1: ScreenReader.Controls.TextArea = controller.Reader.GetElementsOfType("TextArea")[0];
//                        let img: ScreenReader.Controls.CustomImage = controller.Reader.GetElementsOfType("CustomImage")[0];
//                        let custombutton1: ScreenReader.Controls.CustomButton = controller.Reader.GetElementsOfType("CustomButton")[0];
//                        let res = true;
//                        res = res && $(textarea1.HtmlElement).text().indexOf("Welcome to this demo session of Temporal Check All That Apply") > -1;
//                        res = res && img != undefined;
//                        res = res && custombutton1._Action == "GoToNextPage";
//                        assert.ok(res == true, "Welcome screen OK");
//                        custombutton1.Click();
//                        // Ecran 2
//                        let custombuttons: ScreenReader.Controls.CustomButton[] = controller.Reader.GetElementsOfType("CustomButton");
//                        let next: ScreenReader.Controls.CustomButton = custombuttons.filter((x) => { return x._Action == "GoToNextPage" })[0];
//                        let start: ScreenReader.Controls.CustomButton = custombuttons.filter((x) => { return x._Action == "StartChronometer" })[0];
//                        let stop: ScreenReader.Controls.CustomButton = custombuttons.filter((x) => { return x._Action == "StopChronometer" })[0];
//                        let textarea2: ScreenReader.Controls.TextArea = controller.Reader.GetElementsOfType("TextArea")[0];
//                        let cata: ScreenReader.Controls.CATAControl = controller.Reader.GetElementsOfType("CATAControl")[0];
//                        let chronometer: ScreenReader.Controls.CustomChronometer = controller.Reader.GetElementsOfType("CustomChronometer")[0];
//                        let listCb: ScreenReader.Controls.CustomCheckBox[] = cata.GetListCheckboxes();
//                        let cb0: ScreenReader.Controls.CustomCheckBox = listCb[0];
//                        let cb1: ScreenReader.Controls.CustomCheckBox = listCb[1];
//                        let cb2: ScreenReader.Controls.CustomCheckBox = listCb[2];
//                        res = true;
//                        res = res && $(textarea2.HtmlElement).text().indexOf("Please check attributes applicable to sample 894") > -1;
//                        res = res && controller.Reader.Session.Progress.CurrentState.CurrentScreen == 1;
//                        res = res && controller.Reader.Session.Progress.ListData.length == 0;
//                        res = res && cata.Items.length == 20;
//                        res = res && cata.ListData.length == 0;
//                        res = res && cata.IsEnabled == false;
//                        res = res && cata.IsValid == false; // Pas de case cochée : non valide                
//                        res = res && cb0.AttributeCode == "Descriptor_02"; //TODO : test label                
//                        res = res && cb1.AttributeCode == "Descriptor_20"; //TODO : test label  
//                        res = res && cb2.AttributeCode == "Descriptor_03"; //TODO : test label  
//                        res = res && next.IsEnabled == false;
//                        res = res && stop.IsEnabled == false;
//                        res = res && start.IsEnabled == true;
//                        res = res && chronometer.IsStarted == false;
//                        listCb.forEach((x) => res = res && (x.IsEnabled == false));
//                        assert.ok(res == true, "Ecran de mesure initialisé");
//                        // Clic sur START : activation des contrôles
//                        start.Click();
//                        res = true;
//                        res = res && cata.IsEnabled == true;
//                        res = res && next.IsEnabled == false;
//                        res = res && stop.IsEnabled == true;
//                        res = res && start.IsEnabled == false;
//                        listCb.forEach((x) => res = res && (x.IsEnabled == true));
//                        res = res && chronometer.IsStarted == true;
//                        assert.ok(res == true, "Clic sur start : contrôle activé, chrono démarré");
//                        // Clic sur STOP : erreur de validation (pas d'attribut)
//                        stop.Click();
//                        res = true;
//                        res = res && cata.IsValid == false;
//                        res = res && cata.ValidationMessage == Framework.LocalizationManager.Get('AtLeastOneAttributeHaveToBeSelected');
//                        res = res && cata.IsEnabled == true;
//                        res = res && next.IsEnabled == false;
//                        res = res && stop.IsEnabled == true;
//                        res = res && start.IsEnabled == false;
//                        listCb.forEach((x) => res = res && (x.IsEnabled == true));
//                        res = res && chronometer.IsStarted == true;
//                        assert.ok(res == true, "Clic sur stop sans descripteur sélectionné : erreur de validation");
//                        // Clic sur Descriptor_02
//                        cb0.Click(); /*Pause(10);*/
//                        res = true;
//                        res = res && cb0.HtmlElement.style.background != "transparent";
//                        res = res && cb0.IsChecked == true;
//                        res = res && cata.IsValid == true;
//                        res = res && cata.ValidationMessage == "";
//                        res = res && cata.ListData.filter((x) => { return x.AttributeCode == "Descriptor_02" && x.Score == 1 }).length == 1;
//                        assert.ok(res == true, "Un descripteur sélectionné : contrôle OK.");
//                        // Clic sur Descriptor_02 (unclick)
//                        cb0.Click(); /*Pause(10);*/
//                        let d0: Models.Data = cata.ListData.filter((x) => { return x.AttributeCode == "START" })[0];
//                        let d: Models.Data[] = cata.ListData.filter((x) => { return x.AttributeCode == "Descriptor_02" });
//                        let d1: Models.Data = d.filter((x) => { return x.Score == 1 })[0];
//                        let d2: Models.Data = d.filter((x) => { return x.Score == 0 })[0];
//                        res = true;
//                        res = res && cb0.HtmlElement.style.background == "none";
//                        res = res && cb0.IsChecked == false;
//                        res = res && cata.IsValid == true;
//                        res = res && cata.ValidationMessage == "";
//                        res = res && d0.Time == 0;
//                        res = res && d1.Time > 0 && d1.Time < d2.Time;
//                        assert.ok(res == true, "Descripteur désélectionné");
//                        // T max atteint
//                        chronometer.OnMaxTimeReached();
//                        let d3: Models.Data = cata.ListData.filter((x) => { return x.AttributeCode == "STOP" })[0];
//                        res = true;
//                        res = res && cata.IsEnabled == false;
//                        res = res && next.IsEnabled == true;
//                        res = res && stop.IsEnabled == false;
//                        res = res && start.IsEnabled == false;
//                        res = res && d3.Time > 0;
//                        listCb.forEach((x) => res = res && (x.IsEnabled == false));
//                        res = res && chronometer.IsStarted == false;
//                        assert.ok(res == true, "Max time atteint OK."); //TODO : max time sans descripteur sélectionné
//                        // Clic sur NEXT : passage écran suivant
//                        next.Click();
//                        custombuttons = controller.Reader.GetElementsOfType("CustomButton");
//                        next = custombuttons.filter((x) => { return x._Action == "GoToNextPage" })[0];
//                        start = custombuttons.filter((x) => { return x._Action == "StartChronometer" })[0];
//                        stop = custombuttons.filter((x) => { return x._Action == "StopChronometer" })[0];
//                        textarea2 = controller.Reader.GetElementsOfType("TextArea")[0];
//                        cata = controller.Reader.GetElementsOfType("CATAControl")[0];
//                        chronometer = controller.Reader.GetElementsOfType("CustomChronometer")[0];
//                        listCb = cata.GetListCheckboxes();
//                        cb0 = listCb[3];
//                        cb1 = listCb[4];
//                        cb2 = listCb[5];
//                        res = true;
//                        res = res && controller.Reader.Session.Progress.CurrentState.CurrentScreen == 2;
//                        res = res && $(textarea2.HtmlElement).text().indexOf("Please check attributes applicable to sample 685") > -1;
//                        res = res && cata.Items.length == 20;
//                        res = res && cata.IsEnabled == false;
//                        res = res && cata.ListData.length == 0;
//                        res = res && cata.IsValid == false; // Pas de case cochée : non valide                
//                        res = res && cb0.AttributeCode == "Descriptor_18";
//                        res = res && cb1.AttributeCode == "Descriptor_04";
//                        res = res && cb2.AttributeCode == "Descriptor_01";
//                        listCb.forEach((x) => res = res && (x.IsEnabled == false));
//                        assert.ok(res == true, "Passage à l'écran suivant OK.");
//                        //// Ecran 2
//                        start.Click(); Test.Pause(10);
//                        cb0.Click(); Test.Pause(10);
//                        cb1.Click(); Test.Pause(10);
//                        cb2.Click(); Test.Pause(10);
//                        var v = cata.IsValid;
//                        stop.Click();
//                        next.Click();
//                        // Ecran 3
//                        custombuttons = controller.Reader.GetElementsOfType("CustomButton");
//                        next = custombuttons.filter((x) => { return x._Action == "GoToNextPage" })[0];
//                        start = custombuttons.filter((x) => { return x._Action == "StartChronometer" })[0];
//                        stop = custombuttons.filter((x) => { return x._Action == "StopChronometer" })[0];
//                        textarea2 = controller.Reader.GetElementsOfType("TextArea")[0];
//                        cata = controller.Reader.GetElementsOfType("CATAControl")[0];
//                        chronometer = controller.Reader.GetElementsOfType("CustomChronometer")[0];
//                        listCb = cata.GetListCheckboxes();
//                        cb0 = listCb[6];
//                        cb1 = listCb[7];
//                        cb2 = listCb[8];
//                        start.Click(); Test.Pause(10);
//                        cb0.Click(); Test.Pause(10);
//                        cb1.Click(); Test.Pause(10);
//                        cb2.Click(); Test.Pause(10);
//                        stop.Click();
//                        next.Click();
//                        let x0 = Test.GetData(controller.Reader.Session.Progress.ListData, "START", null, 57941668, "Product_01", 1, 1, 1, 97739499, "S001", "TCATA");
//                        let x1 = Test.GetData(controller.Reader.Session.Progress.ListData, "Descriptor_02", 1, 57941668, "Product_01", 1, 1, 1, 97739499, "S001", "TCATA");
//                        let x2 = Test.GetData(controller.Reader.Session.Progress.ListData, "Descriptor_02", 1, 57941668, "Product_01", 1, 1, 0, 97739499, "S001", "TCATA");
//                        let x3 = Test.GetData(controller.Reader.Session.Progress.ListData, "STOP", null, 57941668, "Product_01", 1, 1, 1, 97739499, "S001", "TCATA");
//                        let x4 = Test.GetData(controller.Reader.Session.Progress.ListData, "START", null, 57941668, "Product_02", 3, 1, 1, 97739499, "S001", "TCATA");
//                        let x5 = Test.GetData(controller.Reader.Session.Progress.ListData, "Descriptor_18", 4, 57941668, "Product_03", 2, 1, 1, 97739499, "S001", "TCATA");
//                        let x6 = Test.GetData(controller.Reader.Session.Progress.ListData, "Descriptor_04", 5, 57941668, "Product_03", 2, 1, 1, 97739499, "S001", "TCATA");
//                        let x7 = Test.GetData(controller.Reader.Session.Progress.ListData, "Descriptor_01", 6, 57941668, "Product_03", 2, 1, 1, 97739499, "S001", "TCATA");
//                        let x8 = Test.GetData(controller.Reader.Session.Progress.ListData, "STOP", null, 57941668, "Product_02", 3, 1, 1, 97739499, "S001", "TCATA");
//                        let x9 = Test.GetData(controller.Reader.Session.Progress.ListData, "START", null, 57941668, "Product_03", 2, 1, 1, 97739499, "S001", "TCATA");
//                        let x10 = Test.GetData(controller.Reader.Session.Progress.ListData, "Descriptor_09", 7, 57941668, "Product_02", 3, 1, 1, 97739499, "S001", "TCATA");
//                        let x11 = Test.GetData(controller.Reader.Session.Progress.ListData, "Descriptor_14", 8, 57941668, "Product_02", 3, 1, 1, 97739499, "S001", "TCATA");
//                        let x12 = Test.GetData(controller.Reader.Session.Progress.ListData, "Descriptor_17", 9, 57941668, "Product_02", 3, 1, 1, 97739499, "S001", "TCATA");
//                        let x13 = Test.GetData(controller.Reader.Session.Progress.ListData, "STOP", null, 57941668, "Product_03", 2, 1, 1, 97739499, "S001", "TCATA");
//                        // Ecran 4
//                        ////TODO : test navigation externe
//                        res = true;
//                        res = res && x0.Time == 0;
//                        res = res && x1.Time > 0;
//                        res = res && x2.Time > x1.Time;
//                        res = res && x3.Time > x2.Time;
//                        res = res && x4.Time == 0;
//                        res = res && x5.Time > 0;;
//                        res = res && x6.Time > x5.Time;
//                        res = res && x7.Time > x6.Time;
//                        res = res && x8.Time > x7.Time;
//                        res = res && x9.Time == 0;
//                        res = res && x10.Time > 0;
//                        res = res && x11.Time > x10.Time;
//                        res = res && x12.Time > x11.Time;
//                        res = res && x13.Time > x12.Time;
//                        assert.ok(res == true, "Séance terminée.");
//                        done1();
//                    }
//                });
//            });
//        });
//    }
//}
//# sourceMappingURL=panelisttest.js.map