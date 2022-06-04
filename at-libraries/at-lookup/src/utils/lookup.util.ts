export class LookUpUtil {
    static getSecondaryInfo(url: string): string[] {
        var result: string[] = [];
        if (url.includes(':')) {
            var arr = url.split(':');
            arr.forEach(element => {
                result.push(element);
            });
        }
        return result;
    }
}