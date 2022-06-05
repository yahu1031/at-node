declare interface String {
    /**
     * Returns true if the string is empty(length == 0) else false
     */
    isEmpty: () => boolean;
    /**
     * Returns true if the string is not empty(length != 0) else false
     */
    isNotEmpty: () => boolean;

    replaceFirst(search: string, replacement: string): string;
}

String.prototype.isEmpty = function () {
    return this.length === 0;
};
String.prototype.isNotEmpty = function () {
    return this.length !== 0;
};

String.prototype.replaceFirst = function (search: string, replacement: string) {
    return this.replace(new RegExp(search, 'g'), replacement);
}