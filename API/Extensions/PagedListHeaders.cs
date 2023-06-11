
using System.Text.Json;

namespace API.Extensions
{
    public static class PagedListHeaders
    {
        public static void AddPaginationHeader(this HttpResponse response, int currentPage,int itemsPerPage,int totalCount,int totalPage)
        {
            response.Headers.Add("Pagination", JsonSerializer.Serialize(new
            {
                currentPage,
                itemsPerPage,
                totalCount,
                totalPage
            }));

            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");

        }
    }
}
