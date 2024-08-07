import { formatFullDate } from "./commanFun";
import fallback from '../assets/fallbackimage.png'

export const mappedArray = (arr: any) => {
    let mappedData: any = [];
    if (arr) {
        arr.map((item: any) => {
            let newObj = { image: '', title: '', date: '' };
            const imgArray = item?.acf?.header_image_data !== undefined ? JSON.parse(item?.acf?.header_image_data) : [{ url: fallback }];
            newObj.image = imgArray[0];
            newObj.title = item?.acf?.title;
            newObj.date = item?.type === "events" && ((item?.acf?.event_dates).length ? formatFullDate(item?.acf?.event_dates[0].data) : "") as any;
            mappedData.push(newObj);
        })
    }
    return mappedData

}


