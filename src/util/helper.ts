import { StreamType, StreamConstants } from '../stream';
import { EdgeLocation } from "../fabric";

export function getStreamTypeString(streamType: StreamType): string | false {
    switch (streamType) {
        case StreamType.PERSISTENT_STREAM:
            return StreamConstants.PERSISTENT;
        case StreamType.NON_PERSISTENT_STREAM:
            return StreamConstants.NON_PERSISTENT;
        default:
            return false;
    }
}

export function getFullStreamPath(name: string, streamType: StreamType, local: boolean, extraUrl?: string): string {
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

export const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';