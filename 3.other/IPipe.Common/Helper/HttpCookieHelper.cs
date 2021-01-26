using Microsoft.AspNetCore.Http;
using NPOI.SS.Formula.Functions;
using System;
using System.Collections.Generic;
using System.Text;

namespace IPipe.Common.Helper
{
    public class HttpCookieHelper
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private IRequestCookieCollection _cookies => _httpContextAccessor.HttpContext.Request.Cookies;
        public HttpCookieHelper(IHttpContextAccessor httpContextAccessor) {
            _httpContextAccessor = httpContextAccessor;
        }


        public string GetCookieBykey(string key)
        {
            _cookies.TryGetValue("key",out string value);
            return value;
        }
    }
}
