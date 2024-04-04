declare function postMessage(message: any): void;

importScripts("../../../framework/framework.js");
importScripts("models.js");
importScripts("../../screenreader/models.js");
importScripts("../../../framework/js/crypto-js/jcrypto.js");

self.addEventListener('message', function (e) {

    try {
                    
        var json = e.data;
        if (!(json.substring(0, 1) == "{")) {
            // Chaine cryptée
            Framework.Encryption.DecryptString(json, "a4f25450ec110bd0d3c42f26b2ed8a79", (decrypted: string) => {                                                
                let session = JSON.parse(decrypted);                
                //let session: PanelLeaderModels.Session = PanelLeaderModels.Session.FromJSON(decrypted);
                postMessage(session);
            });
        } else {
            // Chaine non cryptée            
            let session = JSON.parse(json);
            //let session: PanelLeaderModels.Session = PanelLeaderModels.Session.FromJSON(json);
            postMessage(session);

        }
    }
    catch (e) {
        postMessage(null);
    }
}, false);



