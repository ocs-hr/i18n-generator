

module.exports = function (fileContent) {
    fileContent = fileContent.toString();
    var stripped = fileContent.replace(/\/\*[.|\w\s\W\S]*\*\/*/igm, "");
    return stripped.trim();
};