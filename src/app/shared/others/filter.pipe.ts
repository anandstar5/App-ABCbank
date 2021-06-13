import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter'
})

export class FilterPipe implements PipeTransform {

    transform(value: any, filterValue: string, filterBy: string) {
        const returnFilterArray = [];
        if (value.length === 0) {
            return value;
        }
        if (filterValue !== '') {

            const filterByList = filterBy.split('###');

            for (let filterby of filterByList) {
                for (let item of value) {
                    if (!returnFilterArray.includes(item)) {
                        if (item[filterby].toLowerCase().includes(filterValue)) {
                            returnFilterArray.push(item);
                        }
                    }

                }
            }
            //got some error while trying multiple filter with same pipe. so for time being using above approach.

        }
        return returnFilterArray;
    }

}