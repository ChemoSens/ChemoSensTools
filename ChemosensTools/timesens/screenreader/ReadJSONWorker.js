importScripts("../../framework/framework.js");
importScripts("models.js");
importScripts("../screenreader/models.js");
importScripts("../../framework/js/crypto-js/jcrypto.js");
function ReadJson(json, callback) {
    try {
        // Décryption
        if (!(json.substring(0, 1) == "{")) {
            // La chaine est cryptée -> décryption
            Framework.Encryption.DecryptString(json, "3ec914243b4a9b45b95137d74e1cf4fb", function (decrypted) {
                var obj = Framework.Serialization.JsonToInstance(new Models.SubjectSeance(), decrypted);
                callback(obj);
            });
        }
        else {
            // Chaine non cryptée
            var obj = Framework.Serialization.JsonToInstance(new Models.SubjectSeance(), json);
            callback(obj);
        }
    }
    catch (ex) {
        callback(null);
    }
}
self.addEventListener('message', function (e) {
    ReadJson(e.data, function (subjectSeance) {
        postMessage(subjectSeance);
    });
}, false);
//# sourceMappingURL=ReadJSONWorker.js.map