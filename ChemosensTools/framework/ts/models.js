var Models;
(function (Models) {
    var Account = /** @class */ (function () {
        function Account() {
            this.check();
        }
        Account.FromJson = function (json) {
            var license = Framework.Factory.Create(Models.Account, json);
            license.check();
            return license;
        };
        Account.prototype.check = function () {
            if (this.PanelLeaderApplicationSettings == undefined) {
                this.PanelLeaderApplicationSettings = new Models.PanelLeaderApplicationSettings();
            }
            if (this.PanelLeaderApplicationSettings.DisplayName == undefined || this.PanelLeaderApplicationSettings.DisplayName == "") {
                this.PanelLeaderApplicationSettings.DisplayName = this.FirstName + " " + this.LastName;
            }
            if (this.PanelLeaderApplicationSettings.ReturnMailAddress == undefined || this.PanelLeaderApplicationSettings.ReturnMailAddress == "") {
                this.PanelLeaderApplicationSettings.ReturnMailAddress = this.Mail;
            }
            if (this.PanelLeaderApplicationSettings.Language == undefined || this.PanelLeaderApplicationSettings.Language == "") {
                this.PanelLeaderApplicationSettings.Language = Framework.LocalizationManager.GetDisplayLanguage();
            }
        };
        Account.FromLocalStorage = function () {
            var res = Framework.LocalStorage.GetFromLocalStorage("account");
            if (res) {
                return Account.FromJson(res);
            }
            return undefined;
        };
        Account.prototype.SaveInLocalStorage = function () {
            var self = this;
            if (this == undefined) {
                Framework.LocalStorage.RemoveItem("account");
            }
            else {
                var jsonLicense = JSON.stringify(this);
                Framework.LocalStorage.SaveToLocalStorage("account", jsonLicense);
            }
        };
        Account.prototype.CheckForWarning = function () {
            var message = "";
            if (this.PanelLeaderApplicationSettings.LicenceWarningEnabled == null) {
                var dateDiff = Framework.DateDiff.ToDays(new Date(Date.now()), new Date(this.ExpirationDate.toString()));
                if (dateDiff < 10) {
                    message += Framework.LocalizationManager.Format("WarningExpirationDateClose", [dateDiff.toString()]) + "\n";
                }
            }
            return message;
        };
        return Account;
    }());
    Models.Account = Account;
})(Models || (Models = {}));
//# sourceMappingURL=models.js.map