import { STREAM_TYPE } from '../stream';
import { EdgeLocation } from "../fabric";

export const STREAM_CONSTANTS = { NP: "non-persistent", P: "persistent" };

export function getStreamTypeString(streamType: STREAM_TYPE): string | false {
    switch (streamType) {
        case STREAM_TYPE.PERSISTENT_STREAM:
            return STREAM_CONSTANTS.P;
        case STREAM_TYPE.NON_PERSISTENT_STREAM:
            return STREAM_CONSTANTS.NP;
        default:
            return false;
    }
}

export function getFullStreamPath(name: string, streamType: STREAM_TYPE, local: boolean, extraUrl?: string): string {
    const typeString: string | false = getStreamTypeString(streamType);

    if (!typeString) throw "Invalid stream type";

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