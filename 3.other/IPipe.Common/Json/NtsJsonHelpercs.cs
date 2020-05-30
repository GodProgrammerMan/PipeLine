using Newtonsoft.Json;
using System.IO;

namespace IPipe.Common.Json
{
    class NtsJsonHelpercs : IJsonHelper
    {
        public T Deserialize<T>(string json) where T : class
        {
            JsonSerializer jsonSerializer = new JsonSerializer();
            JsonReader reader = new JsonTextReader(new StringReader(json));
            return jsonSerializer.Deserialize<T>(reader);
        }

        public string Serialize(object obj)
        {
            return JsonConvert.SerializeObject(obj);
        }
    }
}
