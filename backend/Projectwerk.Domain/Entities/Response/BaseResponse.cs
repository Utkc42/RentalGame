using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Projectwerk.Domain.Entities.Response
{
    [JsonObject(ItemNullValueHandling = NullValueHandling.Ignore)]
    public class BaseResponse
    {
        #region Properties

        public bool? Success { get; set; }
        public int? StatusCode { get; set; }
        public string? Message { get; set; }
        public string? StackTrace { get; set; }

        #endregion

        #region Constructors

        public BaseResponse()
        {

        }

        public BaseResponse(Exception ex, int? statusCode = null)
        {
            Success = false;
            Message = ex.Message;
            StackTrace = ex.StackTrace;

            if (statusCode != null)
            {
                StatusCode = statusCode;
            }
        }

        public BaseResponse(bool success)
        {
            Success = success;
        }

        public BaseResponse(bool success, string message)
        {
            Success = success;
            if (!string.IsNullOrEmpty(message))
            {
                Message = message;
            }

        }

        #endregion

        #region Methods

        public string ToJson()
        {
            return JsonConvert.SerializeObject(this, Formatting.Indented,
                new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });
		}

        #endregion

    }

    [JsonObject(ItemNullValueHandling = NullValueHandling.Ignore)]
    public class BaseResponse<T> : BaseResponse
    {
        #region Properties

        public T Data { get; set; }

        //public int? Count
        //{
        //    get
        //    {
        //        return Result != null ? Result.Count() : null;
        //    }
        //}

        #endregion

        #region Constructors

        public BaseResponse()
        {

        }

        public BaseResponse(Exception ex)
        {
            Success = false;
            Message = ex.Message;
            StackTrace = ex.StackTrace;
        }

        public BaseResponse(bool success)
        {
            Success = success;
        }

        public BaseResponse(bool success, string message)
        {
            Success = success;

            if (!string.IsNullOrEmpty(message))
            {
                Message = message;
            }
        }

        public BaseResponse(bool success, string message, int errorCode)
        {
            Success = success;

            if (!string.IsNullOrEmpty(message))
            {
                Message = message;
            }
        }

        public BaseResponse(bool success, string message, T data)
        {
            Success = success;

            if (!string.IsNullOrEmpty(message))
            {
                Message = message;
            }

            if (data != null)
            {
                Data = data;
            }

        }

        public BaseResponse(bool success, T data)
        {
            Success = success;

            if (data != null)
            {
                Data = data;
            }
        }

        #endregion
    }
}

