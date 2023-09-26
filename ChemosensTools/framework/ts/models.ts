module Models {

    export class Account {
        public PanelLeaderApplicationSettings: PanelLeaderApplicationSettings;
        public Login: string;
        public Password: string;
        public FirstName: string;
        public LastName: string;
        public Organization: string;
        public Type: string;
        public Country: string;
        public Mail: string;
        public LastAccess: Date;
        public RegistrationDate: Date;
        public ExpirationDate: Date;
        public Expiration: string;
        public IsValid: boolean;
        public AuthorizedApps: string[];

        constructor() {
            this.check();
        }

        public static FromJson(json: string): Account {
            let license: Models.Account = Framework.Factory.Create(Models.Account, json);
            license.check();
            return license;
        }

        private check() {
            if (this.PanelLeaderApplicationSettings == undefined) {
                this.PanelLeaderApplicationSettings = new PanelLeaderApplicationSettings();
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
        }

        public static FromLocalStorage(): Models.Account {
            let res = Framework.LocalStorage.GetFromLocalStorage("account");
            if (res) {
                return Account.FromJson(res);
            }
            return undefined;
        }

        public SaveInLocalStorage() {

            let self = this;

            if (this == undefined) {
                Framework.LocalStorage.RemoveItem("account");
            }
            else {
                let jsonLicense = JSON.stringify(this);
                Framework.LocalStorage.SaveToLocalStorage("account", jsonLicense);
            }
        }

        public CheckForWarning() {
            let message: string = "";
            if (this.PanelLeaderApplicationSettings.LicenceWarningEnabled == null) {
                let dateDiff = Framework.DateDiff.ToDays(new Date(Date.now()), new Date(this.ExpirationDate.toString()));
                if (dateDiff < 10) {
                    message += Framework.LocalizationManager.Format("WarningExpirationDateClose", [dateDiff.toString()]) + "\n";
                }                
            }
            return message;
        }
        
    }

    

}