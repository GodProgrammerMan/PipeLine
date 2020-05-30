namespace IPipe.Common.Json
{
    public interface IJsonHelper
    {
        string Serialize(object obj);


        T Deserialize<T>(string json) where T : class;


    }
}
