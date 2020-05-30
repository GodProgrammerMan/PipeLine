using System.Collections.Generic;
using System.Security.Claims;

namespace IPipe.Common.HttpContextUser
{
    public interface IUserForWeb
    {
        string Name { get; }
        /// <summary>
        /// 用户ID
        /// </summary>
        int uid { get; }
        /// <summary>
        /// 登录名
        /// </summary>
        string loginName { get; }
        /// <summary>
        /// 头像
        /// </summary>
        string headPortrait { get; }
        /// <summary>
        /// 手机号码
        /// </summary>
        string Mobile { get; }
        /// <summary>
        /// 昵称
        /// </summary>
        string nickName { get; }
        /// <summary>
        /// 邮箱
        /// </summary>
        string Email { get; }
        bool IsAuthenticated();
        IEnumerable<Claim> GetClaimsIdentity();
        List<string> GetClaimValueByType(string ClaimType);
    }
}
