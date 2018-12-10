import { StreamConstants } from '../stream';
import { EdgeLocation } from "../fabric";

export function getFullStreamPath(name: string, local: boolean, extraUrl?: string): string {
    const typeString: string = StreamConstants.PERSISTENT;

    const baseUrl = `/streams/${typeString}`;
    let suffix = typeof local === 'boolean' ? `?local=${local}` : '';
    suffix = extraUrl ? `${extraUrl}${suffix}` : suffix;
    const path = name ? `${baseUrl}/stream/${name}${suffix}` : `${baseUrl}${suffix}`;
    return path;
}

export function getDCListString(response: any): string {
    const dcList = response.reduce((acc: string, elem: EdgeLocation, index: number) => {
        if (index > 0) return `${acc},${elem.name}`;
        return elem.name;
    }, "");
    return dcList;
}