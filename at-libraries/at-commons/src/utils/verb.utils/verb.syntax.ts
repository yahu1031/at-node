export class VerbSyntax {
    static from: RegExp | string = /^from:(?<atSign>@?[^@\s]+$)/;
    static pol: RegExp | string = /^pol$/;
    static cram: RegExp | string = /^cram:(?<digest>.+$)/;
    static pkam: RegExp | string = /^pkam:(?<signature>.+$)/;
    static llookup: RegExp | string =
        /^llookup:((?<operation>meta|all):)?(?:cached:)?((?:public:)|(@(?<forAtSign>[^@:\s]*):))?(?<atKey>[^:]((?!:{2})[^@])+)@(?<atSign>[^@\s]+)$/;
    static plookup: RegExp | string =
        /^plookup:(bypassCache:(?<bypassCache>true|false):)?((?<operation>meta|all):)?(?<atKey>[^@\s]+)@(?<atSign>[^@\s]+)$/;
    static lookup: RegExp | string =
        /^lookup:(bypassCache:(?<bypassCache>true|false):)?((?<operation>meta|all):)?(?<atKey>(?:[^:]).+)@(?<atSign>[^@\s]+)$/;
    static scan: RegExp | string =
        /^scan$|scan(:(?<forAtSign>@[^:@\s]+))?(:page:(?<page>\d+))?( (?<regex>\S+))?$/;
    static config: RegExp | string =
        /^config:block:(?<operation>add|remove|show)(?:(?<=show)\s?$|(?:(?<=add|remove):(?<atSign>(?:@[^\s@]+)( (?:@[^\s@]+))*$)))/;
    static stats: RegExp | string =
        /^stats(?<statId>:((?!0)\d+)?(,(\d+))*)?(:(?<regex>(?<=:3:).+))?$/;
    static sync: RegExp | string = /^sync:(?<from_commit_seq>[0-9]+|-1)(:(?<regex>.+))?$/;
    static syncFrom: RegExp | string =
        /^sync:from:(?<from_commit_seq>[0-9]+|-1)(:limit:(?<limit>\d+))(:(?<regex>.+))?$/;
    static update: RegExp | string =
        /^update:json:(?<json>.+)$|^update:(?:ttl:(?<ttl>\d+):)?(?:ttb:(?<ttb>\d+):)?(?:ttr:(?<ttr>(-?)\d+):)?(ccd:(?<ccd>true|false):)?(?:dataSignature:(?<dataSignature>[^:@]+):)?(?:sharedKeyStatus:(?<sharedKeyStatus>[^:@]+):)?(isBinary:(?<isBinary>true|false):)?(isEncrypted:(?<isEncrypted>true|false):)?(sharedKeyEnc:(?<sharedKeyEnc>[^:@]+):)?(pubKeyCS:(?<pubKeyCS>[^:@]+):)?(priority:(?<priority>low|medium|high):)?((?:public:)|(@(?<forAtSign>[^@:\s]*):))?(?<atKey>[^:@]((?!:{2})[^@])+)(?:@(?<atSign>[^@\s]*))? (?<value>.+$)/;
    static update_meta: RegExp | string =
        /^update:meta:((?:public:)|((?<forAtSign>@?[^@\s]*):))?(?<atKey>((?!:{2})[^@])+)@(?<atSign>[^@:\s]*)(:ttl:(?<ttl>\d+))?(:ttb:(?<ttb>\d+))?(:ttr:(?<ttr>\d+))?(:ccd:(?<ccd>true|false))?(?:sharedKeyStatus:(?<sharedKeyStatus>[^:@]+):)?(:isBinary:(?<isBinary>true|false))?(:isEncrypted:(?<isEncrypted>true|false))?(sharedKeyEnc:(?<sharedKeyEnc>[^:@]+):)?(pubKeyCS:(?<pubKeyCS>[^:@]+))?$/;
    static delete: RegExp | string =
        /^delete:(priority:(?<priority>low|medium|high):)?(?:cached:)?((?:public:)|(@(?<forAtSign>[^@:\s]*):))?(?<atKey>[^:]((?!:{2})[^@])+)(@(?<atSign>[^@\s]+))?$/;
    static monitor: RegExp | string = /^monitor(:(?<epochMillis>\d+))?( (?<regex>.+))?$/;
    static stream: RegExp | string =
        /^stream:((?<operation>init|send|receive|done|resume))?((@(?<receiver>[^@:\s]+)))?( ?namespace:(?<namespace>[\w-]+))?( ?startByte:(?<startByte>\d+))?( (?<streamId>[\w-]*))?( (?<fileName>.* ))?((?<length>\d*))?$/;
    static notify: RegExp | string =
        /^notify:(id:(?<id>[\w\d\-\_]+):)?((?<operation>update|delete):)?(messageType:(?<messageType>key|text):)?(priority:(?<priority>low|medium|high):)?(strategy:(?<strategy>all|latest):)?(latestN:(?<latestN>\d+):)?(notifier:(?<notifier>[^\s:]+):)?(ttln:(?<ttln>\d+):)?(ttl:(?<ttl>\d+):)?(ttb:(?<ttb>\d+):)?(ttr:(?<ttr>(-)?\d+):)?(ccd:(?<ccd>true|false):)?(sharedKeyEnc:(?<sharedKeyEnc>[^:@]+):)?(pubKeyCS:(?<pubKeyCS>[^:@]+):)?(@(?<forAtSign>[^@:\s]*)):(?<atKey>[^:@]((?!:{2})[^@])+)(@(?<atSign>[^@:\s]+))?(:(?<value>.+))?$/;
    static notifyList: RegExp | string =
        /^notify:list(:(?<fromDate>\d{4}-[01]?\d?-[0123]?\d?))?(:(?<toDate>\d{4}-[01]?\d?-[0123]?\d?))?(:(?<regex>[^:]+))?/;
    static notifyStatus: RegExp | string = /^notify:status:(?<notificationId>\S+)$/;
    static notifyAll: RegExp | string =
        /^notify:all:((?<operation>update|delete):)?(messageType:((?<messageType>key|text):))?(?:ttl:(?<ttl>\d+):)?(?:ttb:(?<ttb>\d+):)?(?:ttr:(?<ttr>-?\d+):)?(?:ccd:(?<ccd>true|false+):)?(?<forAtSign>(([^:\s])+)?(,([^:\s]+))*)(:(?<atKey>[^@:\s]+))(@(?<atSign>[^@:\s]+))?(:(?<value>.+))?$/;
    static batch: RegExp | string = /^batch:(?<json>.+)$/;
    static info: RegExp | string = /^info(:brief)?$/;
    static noOp: RegExp | string = /^noop:(?<delayMillis>\d+)$/;
    static notifyRemove: RegExp | string = /notify:remove:(?<id>[\w\d\-\_]+)/;
}
