export interface User {
    immediate: 3;
    username: string;
    email: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    first_name?: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    last_name?: string;
    avatar?: string;
    status?: string;
    institutionName: string;
    institutionShortName: string;
}
