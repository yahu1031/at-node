import { AtServerStatus } from "@sign/at-server-status";

var _init = new AtServerStatus({ rootUrl: 'root.atsign.org', rootPort: 64 });

console.log('Searching for secondary address...');
_init.getStatus('@mangotangostable').then((atStatus) => {
    console.log(atStatus.toString());
}).catch((e) => {
    console.error(e);
});