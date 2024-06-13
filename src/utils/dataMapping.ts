import { formatFullDate } from "./commanFun";

export const mappedArray = (arr: any) => {
    let mappedData: any = [];
    if (arr) {
        arr.map((item: any) => {
            let newObj = { image: '', title: '', date: '' };
            const imgArray = item?.acf?.header_image_data ? JSON.parse(item?.acf?.header_image_data) : [{ url: '' }];
            newObj.image = imgArray[0].url
            newObj.title = item?.acf?.title;
            newObj.date = (item?.acf?.event_dates).length ? formatFullDate(item?.acf?.event_dates[0].data) : "";
            mappedData.push(newObj);
        })
    }
    return mappedData

}


