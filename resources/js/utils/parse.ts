import { parse, format, addMonths } from "date-fns";

export const preprocessData = (data: any) => {
    const startDate = parse(Object.keys(data)[0], "MM-yyyy", new Date());
    const endDate = parse(
        Object.keys(data)[Object.keys(data).length - 1],
        "MM-yyyy",
        new Date()
    );

    const processedData: { [key: string]: number | null } = {};
    let currentDate = startDate;

    while (currentDate <= endDate) {
        const formattedDate = format(currentDate, "MM-yyyy");
        processedData[formattedDate] = data[formattedDate] || null;
        currentDate = addMonths(currentDate, 1);
    }

    return processedData;
};
