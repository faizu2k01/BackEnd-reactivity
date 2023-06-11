export interface Pagination{
    currentPage:number,
    totalPage:number,
    pageSize:number,
    totalCount:number
}
export class PagedList<T>{
    data:T;
    pagination:Pagination;
    constructor(data:T,pagination:Pagination) {
        this.data = data;
        this.pagination = pagination;
    }
}


export class PaginationParams{
    pageNumber;
    pageSize;
    constructor(pageNumber=1,pageSize=5){
        this.pageNumber=pageNumber;
        this.pageSize=pageSize;
    }
}