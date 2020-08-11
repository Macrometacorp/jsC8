// import { StreamConstants } from '../stream';
import { EdgeLocation } from "../fabric";

export function getFullStreamPath(topic: string, extraUrl?: string): string {
  const baseUrl = `/streams/${topic}`;

  const path = extraUrl ? `${baseUrl}${extraUrl}` : baseUrl;

  return path;
}

export function getDCListString(response: any): string {
  const dcList = response.reduce(
    (acc: string, elem: EdgeLocation, index: number) => {
      if (index > 0) return `${acc},${elem.name}`;
      return elem.name;
    },
    ""
  );
  return dcList;
}
