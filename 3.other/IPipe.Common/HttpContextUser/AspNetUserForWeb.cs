using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace IPipe.Common.HttpContextUser
{
    public class AspNetUserForWeb : IUserForWeb
    {
        private readonly IHttpContextAccessor _accessor;

        public AspNetUserForWeb(IHttpContextAccessor accessor)
        {
            _accessor = accessor;
        }

        public string Name => _accessor.HttpContext.User.Identity.Name;

        public int uid => GetUid();

        public int GetUid()
        {
            try
            {
                return int.Parse(GetClaimValueByType("uid").First());
            }
            catch (Exception)
            {
                return 0;
            }
        }


        public string loginName => GetLoginName();

        public string GetLoginName()
        {
            try
            {
                return GetClaimValueByType("loginName").First();
            }
            catch (Exception)
            {
                return "";
            }
        }


        public string headPortrait => GetheadPortrait();

        public string GetheadPortrait()
        {
            try
            {
                return GetClaimValueByType("headPortrait").First();
            }
            catch (Exception)
            {
                return "";
            }
        }

        public string Mobile => GetMobile();

        public string GetMobile()
        {
            try
            {
                return GetClaimValueByType("Mobile").First();
            }
            catch (Exception)
            {
                return "";
            }

        }

        public string nickName => GetnickName();

        public string GetnickName()
        {
            try
            {
                return GetClaimValueByType("nickName").First();
            }
            catch (Exception)
            {
                return "";
            }
        }

        public string Email => GetEmail();

        public string GetEmail()
        {
            try
            {
                return GetClaimValueByType("Email").First();
            }
            catch (Exception)
            {
                return "";
            }
        }

        public bool IsAuthenticated()
        {
            return _accessor.HttpContext.User.Identity.IsAuthenticated;
        }

        public IEnumerable<Claim> GetClaimsIdentity()
        {
            return _accessor.HttpContext.User.Claims;
        }

        public List<string> GetClaimValueByType(string ClaimType)
        {
            return (from item in GetClaimsIdentity()
                    where item.Type == ClaimType
                    select item.Value).ToList();
        }


    }
}
