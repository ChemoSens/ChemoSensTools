declare function postMessage(message: any): void;

importScripts("../../framework/framework.js");
importScripts("models.js");
importScripts("../screenreader/models.js");
importScripts("../../framework/js/crypto-js/jcrypto.js");

function ReadJson(json: string, callback: (subjectSeance: Models.SubjectSeance)=>void) {
    try {
        // Décryption
        if (!(json.substring(0, 1) == "{")) {
            // La chaine est cryptée -> décryption
            Framework.Encryption.DecryptString(json, "3ec914243b4a9b45b95137d74e1cf4fb", (decrypted:string) => {
                var obj: Models.SubjectSeance = Framework.Serialization.JsonToInstance(new Models.SubjectSeance(), decrypted);
                callback(obj);
            });
        } else {
            // Chaine non cryptée
            var obj: Models.SubjectSeance = Framework.Serialization.JsonToInstance(new Models.SubjectSeance(), json);
            callback(obj);
        }        
    }
    catch (ex) {
        callback(null);
    }
}

self.addEventListener('message', function (e) {
    ReadJson(e.data, (subjectSeance) => {
        postMessage(subjectSeance);
    });    
}, false);





