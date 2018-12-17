export class SearchInfo {

  constructor(
    public keyword: string,
    public category: string,
    public distanceValue: number,
    public distanceUnit: string,
    public fromLat: number,
    public fromLon: number,
    public from: string
  ) {  }

}
