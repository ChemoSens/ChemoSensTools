module FrameworkTest {

    export function Start() {

        QUnit.module("Framework", function (websiteContext) {

            QUnit.module("LocalizationManager", function (test) {

                QUnit.test("Affichage anglais OK", function (assert) {
                    assert.expect(2);
                    var done = assert.async();
                    Framework.LocalizationManager.LoadResources(['../resources/panelist.json'], 'en', () => {
                        assert.ok(Framework.LocalizationManager.GetDisplayLanguage() == 'en', "Changement langue vers EN OK.");
                        assert.ok(Framework.LocalizationManager.Get("Browse") == "Browse...", "Traduction anglaise de la clé 'Browse' de panelist.json  OK");
                        done();
                    });
                });

                QUnit.test("Affichage afrançais OK", function (assert) {
                    assert.expect(2);
                    var done = assert.async();
                    Framework.LocalizationManager.LoadResources(['../resources/panelist.json'], 'fr', () => {
                        assert.ok(Framework.LocalizationManager.GetDisplayLanguage() == 'fr', "Changement langue vers FR OK.");
                        assert.ok(Framework.LocalizationManager.Get("Browse") == "Parcourir...", "Traduction française de la clé 'Browse' de panelist.json  OK");
                        done();
                    });
                });
            });

        });

    }
}